import { useCallback, useEffect, useState } from "react";
import styles from "./App.module.css";

type IPlayerType = {
  levels: {
    type: number;
    isAvailable: boolean;
  }[];
};

type ISpaceType = {
  markedBy: "p1" | "p2" | undefined;
  level?: number;
};

type ICurrentRoundType = {
  player?: "p1" | "p2";
  level?: number;
};

export default function App() {
  const [players, setPlayer] = useState<IPlayerType[]>([]);
  const [spaces, setSpaces] = useState<ISpaceType[]>([]);
  const [currentRound, setCurrentRound] = useState<ICurrentRoundType>();

  console.log(spaces, players, currentRound);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = useCallback(() => {
    setSpaces(new Array(9).fill({}));
    const levels = new Array(6).fill(" ").map((_, index) => ({
      type: index + 1,
      isAvailable: true,
    }));

    setPlayer([{ levels }, { levels }]);
    setCurrentRound({ player: "p1" });
  }, []);

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

    const gameIsOver = possibilidades.some((possibilidade) => {
      var initialPlayer: any;

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
      alert(`Jogador ${currentRound?.player} venceu!!!`);

      initializeGame();

      return;
    }
    setCurrentRound((state) => {
      if (state?.player === "p1") {
        return { player: "p2" };
      } else {
        return { player: "p1" };
      }
    });
  }, [spaces]);

  const handleSetPosition = useCallback(
    (position: number) => {
      if (!!!currentRound?.level) {
        alert("Selecione um level para marcar uma posição!");

        return;
      }

      setSpaces((state) =>
        state.map((space, index) => {
          if (position === index) {
            return { markedBy: currentRound.player, level: currentRound.level };
          }

          return space;
        }),
      );

      if (currentRound.player === "p1") {
        setPlayer((state) => {
          const [p1, p2] = state;

          const p12 = p1.levels.map((level) => {
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
        setPlayer((state) => {
          const [p1, p2] = state;

          const p22 = p2.levels.map((level) => {
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
    [currentRound],
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

  return (
    <div className="">
      <h2 className="mb-10 text-3xl">
        Agora é a vez do <strong> jogador {currentRound?.player}</strong>
      </h2>

      <div className="flex">
        <section className={styles.levels}>
          <p>Jogador P1</p>
          {players[0]?.levels.map((level, index) => (
            <div
              key={index}
              className={`${styles.level}  ${
                currentRound?.player === "p1" &&
                currentRound?.level === level.type &&
                styles.levelSelected
              }`}
              onClick={() => {
                handleSelectLevel("p1", level.type);
              }}
            >
              {level.isAvailable ? level.type : " "}
            </div>
          ))}
        </section>

        <section className={styles.table}>
          {spaces.map((space, index) => (
            <div
              key={index}
              className={styles.space}
              onClick={() => {
                handleSetPosition(index);
              }}
            >
              {space.markedBy} {space.level}
            </div>
          ))}
        </section>

        <section className={styles.levels}>
          <p>Jogador P2</p>
          {players[1]?.levels.map((level, index) => (
            <div
              key={index}
              className={`${styles.level}  ${
                currentRound?.player === "p2" &&
                currentRound?.level === level.type &&
                styles.levelSelected
              }`}
              onClick={() => {
                handleSelectLevel("p2", level.type);
              }}
            >
              {level.isAvailable ? level.type : " "}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
