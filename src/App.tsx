import styles from "./app.module.css";
import { useEffect, useState } from "react";
import { WORDS } from "../utils/words.ts";
import type { Challenge } from "../utils/words";
import { Tip } from "./components/Tip";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Letter } from "./components/Letter";
import { Header } from "./components/Header";
import { LetterUsed } from "./components/LettersUsed";
import type { LetterUsedProps } from "./components/LettersUsed";

export default function App() {
  const [score, setScore] = useState(0);
  const [letter, setLetter] = useState("");
  const [letterUsed, setLetterUsed] = useState<LetterUsedProps[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [shake, setShake] = useState(false);


  const ATTEMPTS_MARGIN = 5


  function handleRestartGame() {
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")

    if (isConfirmed) {
      startGame()
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length);
    const randomWord = WORDS[index];

    setChallenge(randomWord);

    setScore(0)
    setLetter("")
    setLetterUsed([])

  }

  function handleConfirm() {
    if (!challenge) {
      return
    }
    if (!letter.trim()) {
      return alert("Digite uma letra!")
    }
    const value = letter.toUpperCase()
    const exists = letterUsed.find((used) => used.value.toUpperCase() === value)

    if (exists) {
      setLetter("")
      return alert("Você já utilizou a letra " + value)
    }
    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length

    const correct = hits > 0
    const currentScore = score + hits


    setLetterUsed((prevState) => [...prevState, { value, correct }])
    setScore(currentScore)

    setLetter("")
    if (!correct) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }
  }

  function endGame(message: string) {
    alert(message)
    startGame()
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (!challenge) {
      return
    }
    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame("Parabéns, você descobriu a palavra!")
      }
      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN

      if (letterUsed.length === attemptLimit) {
        return endGame("Que pena você usou todas as tentativas!")
      }

    }, 200)
  }, [score, letterUsed.length])


  if (!challenge)
    return

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={letterUsed.length}
          max={challenge.word.length + ATTEMPTS_MARGIN}
          onRestart={handleRestartGame} />


        <Tip tip={challenge.tip} />


        <div className={`${styles.word} ${shake && styles.shake}`}>



          {challenge.word.split("").map((letter, index) => {
            const usedMatch = letterUsed.find(
              (used) => used.value.toUpperCase() === letter.toUpperCase()
            );


            return (<Letter
              key={index}
              value={usedMatch?.value}
              color={usedMatch?.correct ? "correct" : "default"} />
            )
          })}



        </div>

        <h4>Palpite</h4>
        <div className={styles.guess}>
          <Input
            autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LetterUsed data={letterUsed} />

      </main>
    </div>
  )
}

