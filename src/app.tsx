import React, { useCallback, useEffect, useReducer, useState } from "react";
import styles from "./app.module.css";
import {
  Cell,
  reduceNextGeneration,
  createEmptyGird,
  replaceItemInArray,
  toggleLivingState,
  randomGenerate,
} from "./core";
const sizeUpperBound = 100;
const initSize = "50";
const initRandomRate = "61.8";
const initInterval = "200";
const intervalLowerBound = 100;
type InputHandle = NonNullable<
  React.InputHTMLAttributes<HTMLInputElement>["onChange"]
>;
const toggleBoolean = (state: boolean) => !state;
const increase = (count: number) => count + 1;
const useNumberInput = (init: string) => {
  const [numberInput, setNumberInput] = useState(init);
  const number = +numberInput;
  return {
    number,
    binding: {
      value: numberInput,
      onChange: useCallback<InputHandle>(
        (e) => setNumberInput(e.target.value),
        []
      ),
    },
  };
};
export const App: React.FC = () => {
  const [playing, togglePlaying] = useReducer(toggleBoolean, false);
  const { number: rows, binding: rowBinding } = useNumberInput(initSize);
  const { number: columns, binding: columnBinding } = useNumberInput(initSize);
  const { number: interval, binding: intervalBinding } =
    useNumberInput(initInterval);
  const { number: random, binding: randomRateBinding } =
    useNumberInput(initRandomRate);
  const isInvalidRandom = 0 > random || random >= 100;
  const [grid, setGrid] = useState<Cell[][]>(() =>
    createEmptyGird(rows, columns)
  );
  const isToLarge = rows > sizeUpperBound || columns > sizeUpperBound;
  const isInvalidSize = [rows, columns].some(
    (n) => isNaN(n) || n !== Math.floor(n) || n <= 0
  );
  const isTooFast = interval < intervalLowerBound;
  const message = isToLarge
    ? "The size is too large. The browser may suffer from perfomance issue."
    : isTooFast
    ? "The interval is too small. The browser may suffer from performace issue."
    : isInvalidRandom
    ? "Invalid random rate"
    : isInvalidSize
    ? "Invalid size."
    : null;
  const handleChangeGridSize = useCallback(() => {
    setGeneration(0);
    setGrid(createEmptyGird(rows, columns));
  }, [rows, columns]);
  const handleRandomGenerate = useCallback(() => {
    setGeneration(0);
    setGrid(randomGenerate(rows, columns, random));
  }, [rows, columns, random]);
  const [generation, setGeneration] = useState(0);
  const handleNext = useCallback(() => {
    setGeneration(increase);
    setGrid(reduceNextGeneration);
  }, []);
  const handleReset = useCallback(() => {
    setGeneration(0);
    setGrid((oldGrid) =>
      oldGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isLiving: cell.initLiving,
        }))
      )
    );
  }, []);
  useEffect(() => {
    if (playing) {
      const timer = setInterval(handleNext, interval);
      return () => {
        clearInterval(timer);
      };
    }
  }, [playing, handleNext, interval]);
  return (
    <section className={styles["app-wrapper"]}>
      <header>
        <form className={styles["input-form"]}>
          <label htmlFor="row">Rows</label>
          <input
            name="row"
            type="number"
            placeholder="input rows"
            disabled={playing}
            {...rowBinding}
          ></input>
          <label htmlFor="column">Columns</label>
          <input
            name="column"
            type="number"
            placeholder="input columns"
            disabled={playing}
            {...columnBinding}
          ></input>
          <label htmlFor="random">Random Rate</label>
          <input
            name="random"
            type="number"
            placeholder="input random rate"
            disabled={playing}
            {...randomRateBinding}
          ></input>
          %<label htmlFor="interval">Play Interval</label>
          <input
            name="interval"
            type="number"
            placeholder="input interval"
            disabled={playing}
            {...intervalBinding}
          ></input>
          ms
        </form>
        <div className={styles.actions}>
          <button
            onClick={handleChangeGridSize}
            disabled={playing || isInvalidSize}
          >
            Change Grid Size
          </button>
          <button
            onClick={handleRandomGenerate}
            disabled={playing || isInvalidRandom}
          >
            Random Generate
          </button>
          <button onClick={handleNext} disabled={playing}>
            Next
          </button>
          <button onClick={handleReset} disabled={playing}>
            Reset
          </button>
          <button onClick={togglePlaying}>{playing ? "Stop" : "Play"}</button>
        </div>
        <div>
          <span className={styles.warning}>{message}</span>
          <span>{generation} Generation</span>
        </div>
      </header>
      <main>
        <div className={`${styles.grid} ${styles.wrapper}`}>
          {grid.map((row, i) => (
            <div key={i} className={`${styles["grid-row"]} ${styles.wrapper}`}>
              {row.map(({ isLiving }, j) => (
                <div
                  key={j}
                  className={`${styles["grid-cell"]} ${styles.wrapper} ${
                    isLiving ? styles.living : styles.dead
                  }`}
                  onClick={() => {
                    setGrid((oldGrid) =>
                      replaceItemInArray(
                        oldGrid,
                        i,
                        replaceItemInArray(
                          oldGrid[i],
                          j,
                          toggleLivingState(oldGrid[i][j])
                        )
                      )
                    );
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};
