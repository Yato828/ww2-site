import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, ExternalLink, RotateCcw, X } from 'lucide-react'
import { questions } from '../../data/history'
import './quiz.css'

export default function QuizPage() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const navigationRequested = useRef(false)
  const reduceMotion = useReducedMotion()
  const question = questions[index]
  const score = answers.filter((answer, answerIndex) => answer === questions[answerIndex].answer).length

  const focusNewStep = useCallback((node: HTMLElement | null) => {
    if (node && navigationRequested.current) {
      node.focus()
      navigationRequested.current = false
    }
  }, [])

  function checkAnswer() {
    if (selected === null || checked) return
    setAnswers((previous) => [...previous, selected])
    setChecked(true)
  }

  function nextQuestion() {
    if (!checked) return
    navigationRequested.current = true
    if (index === questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex((previous) => previous + 1)
    setSelected(null)
    setChecked(false)
  }

  function restart() {
    navigationRequested.current = true
    setIndex(0)
    setSelected(null)
    setChecked(false)
    setAnswers([])
    setFinished(false)
  }

  if (!question) {
    return <div className="page-container quiz-page"><h1 className="page-heading">Что мы помним?</h1><p>Вопросы пока недоступны.</p></div>
  }

  return (
    <div className="page-container quiz-page">
      <header className="quiz-intro">
        <div><p className="eyebrow">Проверьте свои знания</p><h1 className="page-heading">Что мы <em>помним?</em></h1></div>
        <p className="lead">История начинается с вопросов. {questions.length} шагов, чтобы вспомнить важное и узнать чуть больше.</p>
      </header>

      <div className="quiz-body">
        <aside className="quiz-side">
          <span className="quiz-side-number" aria-hidden="true">{finished ? String(score).padStart(2, '0') : String(index + 1).padStart(2, '0')}</span>
          <span className="quiz-side-caption">{finished ? 'верных ответов' : `вопрос из ${questions.length}`}</span>
          <div className="quiz-progress"><label htmlFor="quiz-progress">{finished ? 'Завершено' : 'Ваш путь'}<span>{answers.length} / {questions.length}</span></label><progress id="quiz-progress" value={answers.length} max={questions.length} /></div>
          <p className="quiz-side-note">Здесь нет ограничения по времени. После каждого ответа — объяснение и ссылка на источник.</p>
          <div className="quiz-thread" aria-hidden="true"><span /><span /><span /></div>
        </aside>

        <div className="quiz-content">
          <AnimatePresence mode="wait" initial={false}>
            {finished ? (
              <motion.section ref={focusNewStep} tabIndex={-1} key="result" className="quiz-result" aria-label="Результат проверки знаний" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
                <p className="eyebrow">Путь пройден</p>
                <h2>{score === questions.length ? 'Вы многое помните.' : 'Каждый вопрос — повод узнать больше.'}</h2>
                <p className="quiz-result-score"><strong>{score}</strong><span>из {questions.length}<br />верных ответов</span></p>
                <p className="quiz-result-message">Память не измеряется баллами. Сохраните интерес к истории: прочитайте источники, поговорите с близкими, загляните в семейный архив.</p>
                <button className="button button-primary" type="button" onClick={restart}><RotateCcw size={16} aria-hidden="true" />Пройти ещё раз</button>
                <details className="quiz-review"><summary>Посмотреть все ответы</summary><ol>{questions.map((item, itemIndex) => <li key={item.id}><h3>{item.question}</h3><p className={answers[itemIndex] === item.answer ? 'quiz-review-correct' : 'quiz-review-wrong'}>{answers[itemIndex] === item.answer ? 'Верно' : 'Ваш ответ: ' + item.options[answers[itemIndex]]}</p><p><strong>Правильный ответ:</strong> {item.options[item.answer]}</p><p>{item.explanation}</p><a className="source-link" href={item.source.url} target="_blank" rel="noreferrer">{item.source.title}<ExternalLink size={12} aria-hidden="true" /></a></li>)}</ol></details>
              </motion.section>
            ) : (
              <motion.section ref={focusNewStep} tabIndex={-1} key={question.id} className="quiz-question" initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
                <fieldset className="quiz-fieldset"><legend>{question.question}</legend><div className="quiz-options">{question.options.map((option, optionIndex) => {
                  const isCorrect = checked && optionIndex === question.answer
                  const isWrong = checked && selected === optionIndex && !isCorrect
                  return <label className={`quiz-option ${selected === optionIndex ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''} ${checked ? 'is-checked' : ''}`} key={optionIndex}><input type="radio" name={`question-${question.id}`} value={optionIndex} checked={selected === optionIndex} onChange={() => setSelected(optionIndex)} disabled={checked} /><span className="quiz-option-letter" aria-hidden="true">{String.fromCharCode(1040 + optionIndex)}</span><span className="quiz-option-text">{option}</span><span className="quiz-option-status" aria-hidden="true">{isCorrect ? <Check size={19} /> : isWrong ? <X size={19} /> : <span />}</span></label>
                })}</div></fieldset>
                {checked && <div className={`quiz-explanation ${selected === question.answer ? 'is-correct' : ''}`} role="status"><p className="quiz-explanation-title">{selected === question.answer ? <><Check size={17} aria-hidden="true" />Верно</> : <>Правильный ответ: {question.options[question.answer]}</>}</p><p>{question.explanation}</p><a className="source-link" href={question.source.url} target="_blank" rel="noreferrer">{question.source.title}<ExternalLink size={12} aria-hidden="true" /><span className="sr-only"> (откроется в новой вкладке)</span></a></div>}
                <div className="quiz-actions">{checked ? <button className="button button-primary" type="button" onClick={nextQuestion}>{index === questions.length - 1 ? 'Посмотреть результат' : 'Следующий вопрос'}<ArrowRight size={17} aria-hidden="true" /></button> : <><button className="button button-primary" type="button" disabled={selected === null} onClick={checkAnswer}>Проверить ответ<ArrowRight size={17} aria-hidden="true" /></button><span className="quiz-action-hint">Выберите один вариант</span></>}</div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
