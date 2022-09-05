/* eslint-disable react/no-array-index-key */

import { useCallback, useEffect, useState } from "react";
import Lottie from "react-lottie";

import p1AnimationDeployed from "../assets/chars/p1/deployed.json";
import p1AnimationSelected from "../assets/chars/p1/selected.json";
import p1AnimationWait from "../assets/chars/p1/waiting.json";
import p2AnimationDeployed from "../assets/chars/p2/deployed.json";
import p2AnimationSelected from "../assets/chars/p2/selected.json";
import p2AnimationWait from "../assets/chars/p2/waiting.json";
import styles from "./App.module.css";

interface IPlayerType {
  levels: Array<{
    type: number;
    isAvailable: boolean;
  }>;
}

interface ISpaceType {
  markedBy: "p1" | "p2" | undefined;
  level?: number;
}

interface ICurrentRoundType {
  player?: "p1" | "p2";
  level?: number;
}

export default function App() {
  const [players, setPlayer] = useState<IPlayerType[]>([]);
  const [spaces, setSpaces] = useState<ISpaceType[]>([]);
  const [currentRound, setCurrentRound] = useState<ICurrentRoundType>();

  // console.log(spaces, players, currentRound);

  const initializeGame = useCallback(() => {
    setSpaces(new Array(9).fill({}));
    const levels = new Array(6).fill(" ").map((_, index) => ({
      type: index + 1,
      isAvailable: true,
    }));

    setPlayer([{ levels }, { levels }]);
    setCurrentRound(state => {
      // console.log({ state });

      if (state?.player === "p1") {
        return { player: "p2" };
      }
      return { player: "p1" };
    });
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    const horizontal1 = [0, 1, 2];
    const horizontal2 = [3, 4, 5];
    const horizontal3 = [6, 7, 8];
    const vertical1 = [0, 3, 6];
    const vertical2 = [1, 4, 7];
    const vertical3 = [2, 5, 8];
    const diagonal = [0, 4, 8];

    const possibilidades = [
      horizontal1,
      horizontal2,
      horizontal3,
      vertical1,
      vertical2,
      vertical3,
      diagonal,
    ];

    const gameIsOver = possibilidades.some(possibilidade => {
      let initialPlayer: any;

      return possibilidade.every((position, index) => {
        const player = spaces[position]?.markedBy;
        if (player === undefined) {
          return false;
        }

        if (index === 0) {
          initialPlayer = player;
        }

        return player === initialPlayer;
      });
    });

    console.log({ gameIsOver });

    if (gameIsOver) {
      alert(`Jogador ${currentRound?.player ?? ""} venceu!!!`);

      initializeGame();

      return;
    }
    setCurrentRound(state => {
      if (state?.player === "p1") {
        return { player: "p2" };
      }
      return { player: "p1" };
    });
  }, [initializeGame, spaces]);

  const handleSetPosition = useCallback(
    (position: number) => {
      if (currentRound?.level === undefined) {
        alert("Selecione um level para marcar uma posição!");

        return;
      }

      const isValidMove = spaces.every((space, index) => {
        if (position === index && !!currentRound.level && space.level) {
          return !(space.level >= currentRound.level);
        }

        return true;
      });

      if (!isValidMove) {
        alert("Jogada inválida");
        return;
      }

      setSpaces(state =>
        state.map((space, index) => {
          if (position === index) {
            return { markedBy: currentRound.player, level: currentRound.level };
          }

          return space;
        }),
      );

      if (currentRound.player === "p1") {
        setPlayer(state => {
          const [p1, p2] = state;

          const p12 = p1.levels.map(level => {
            if (level.type === currentRound.level) {
              return {
                ...level,
                isAvailable: false,
              };
            }

            return level;
          });

          return [{ levels: p12 }, p2];
        });
      } else {
        setPlayer(state => {
          const [p1, p2] = state;

          const p22 = p2.levels.map(level => {
            if (level.type === currentRound.level) {
              return {
                ...level,
                isAvailable: false,
              };
            }

            return level;
          });

          return [p1, { levels: p22 }];
        });
      }
    },
    [currentRound, spaces],
  );

  const handleSelectLevel = useCallback(
    (player: "p1" | "p2", level: number) => {
      if (currentRound?.player !== player) {
        alert(`Agora é a vez do jogador ${currentRound?.player}`);

        return;
      }

      setCurrentRound({ player, level });
    },
    [currentRound],
  );

  function calcSize(level: number, max: number): number {
    // console.log({ level, calc, calc2, calc3 });

    const calc4 = max - 6 * (level + 1);
    console.log({ level, calc4 });

    // 80px max
    return calc4;
  }

  return (
    <div className="">
      <h2 className="mb-10 text-3xl">
        Agora é a vez do <strong> jogador {currentRound?.player}</strong>
      </h2>

      <div className="flex w-max">
        <section className={styles.levels}>
          <p>Time dos Magos</p>
          {players[0]?.levels.map((level, index) => (
            <div
              key={index}
              className={`${styles.level} ${
                currentRound?.player === "p1" &&
                currentRound?.level === level.type
                  ? styles.levelSelected
                  : ""
              }`}
              style={{
                padding: `${calcSize(level.type || 0, 30)}px`,
                width: 220,
                height: 220,
              }}
            >
              <button
                type="button"
                className=""
                onClick={() => {
                  handleSelectLevel("p1", level.type);
                }}
              >
                {level.isAvailable && (
                  <>
                    <Lottie
                      options={{
                        animationData:
                          currentRound?.player === "p1" &&
                          currentRound?.level === level.type
                            ? p1AnimationSelected
                            : p1AnimationWait,

                        loop: true,
                        autoplay: true,
                        rendererSettings: {
                          preserveAspectRatio: "xMidYMid slice",
                        },
                      }}
                      // height={level.type * 30 * 0.9}
                      // width={(level.type / 3) * 20 * 4.9}
                    />
                    <p>{level.type}</p>
                  </>
                )}
              </button>
            </div>
          ))}
        </section>

        <section className={styles.table}>
          {spaces.map((space, index) => (
            <button
              type="button"
              key={index}
              className={styles.space}
              onClick={() => {
                handleSetPosition(index);
              }}
              style={{
                padding: `${calcSize(space.level || 0, 80)}px`,
              }}
            >
              {space.markedBy && (
                <Lottie
                  options={{
                    animationData:
                      space.markedBy === "p1"
                        ? p1AnimationDeployed
                        : p2AnimationDeployed,

                    loop: true,
                    autoplay: true,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  // height={((space.level || 1) / 1) * 50}
                  // width={((space.level || 1) + 20 / 1) * 1}
                  // height={`${
                  //   space.level || 0 < 2
                  //     ? ((space.level || 1) / 4) * 100
                  //     : ((space.level || 1) / 2) * 100
                  // }%`}
                  // width={`${
                  //   space.level || 0 < 2
                  //     ? ((space.level || 1) / 6) * 100
                  //     : ((space.level || 1) / 6) * 100
                  // }%`}
                />
              )}
              <p className="font-bold text-lg"> {space.level}</p>
            </button>
          ))}
        </section>

        <section className={styles.levels}>
          <p>Time dos Monstros</p>
          {players[1]?.levels.map((level, index) => (
            <div key={index}>
              {level.isAvailable && (
                <button
                  type="button"
                  className={`${styles.level}  ${
                    currentRound?.player === "p2" &&
                    currentRound?.level === level.type &&
                    styles.levelSelected
                  }`}
                  onClick={() => {
                    handleSelectLevel("p2", level.type);
                  }}
                >
                  <Lottie
                    options={{
                      animationData:
                        currentRound?.player === "p2" &&
                        currentRound?.level === level.type
                          ? p2AnimationSelected
                          : p2AnimationWait,

                      loop: true,
                      autoplay: true,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                    height={level.type * 28 * 1.1}
                    width={(level.type / 4) * 36 * 2.5}
                  />
                  <p>{level.type}</p>
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
