import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const questions = [
  {
    question: 'Welche Gefahr geht von Tackcon Superflex aus?',
    options: [
      'Keine besonderen Gefahren',
      'Kann allergische Reaktionen hervorrufen',
      'Es ist essbar',
      'Gefriert bei Raumtemperatur'
    ],
    answer: 1
  },
  {
    question: 'Welche Schutzausrüstung ist empfohlen?',
    options: [
      'Sonnenbrille',
      'Hausschuhe',
      'Schutzbrille und Handschuhe',
      'Ohrenstöpsel'
    ],
    answer: 2
  }
];

export default function UnterweisungApp() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (index) => {
    if (index === questions[currentQ].answer) {
      setScore(score + 1);
    }
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    if (name.trim() !== '') {
      const eintrag = {
        name,
        score,
        total: questions.length,
        date: new Date().toLocaleDateString(),
      };
      const gespeicherte = JSON.parse(localStorage.getItem('unterweisungen') || '[]');
      gespeicherte.push(eintrag);
      localStorage.setItem('unterweisungen', JSON.stringify(gespeicherte));
      setConfirmed(true);
      setStep(3);
    }
  };

  const [showList, setShowList] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const gespeicherte = JSON.parse(localStorage.getItem('unterweisungen') || '[]');
    setEntries(gespeicherte);
  }, [confirmed]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gefahrstoff-Unterweisung: Tackcon Superflex</h1>

      {step === 1 && (
        <Card>
          <CardContent className="space-y-4">
            <p className="font-semibold">Frage {currentQ + 1} von {questions.length}</p>
            <p>{questions[currentQ].question}</p>
            {questions[currentQ].options.map((option, index) => (
              <Button key={index} variant="outline" className="block w-full text-left my-1" onClick={() => handleAnswer(index)}>
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="space-y-4">
            <p>Du hast {score} von {questions.length} Fragen richtig beantwortet.</p>
            <p>Bitte gib deinen Namen ein, um die Unterweisung zu bestätigen:</p>
            <Input placeholder="Vor- und Nachname" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={handleConfirm}>Bestätigen</Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && confirmed && (
        <Card>
          <CardContent className="space-y-4">
            <p className="text-green-600 font-semibold">Vielen Dank, {name}! Deine Unterweisung wurde erfolgreich abgeschlossen.</p>
            <p>Datum: {new Date().toLocaleDateString()}</p>
            <Button onClick={() => window.print()}>PDF / Nachweis drucken</Button>
            <Button variant="outline" onClick={() => setShowList(true)}>Alle Einträge anzeigen</Button>
          </CardContent>
        </Card>
      )}

      {showList && (
        <Card className="mt-6">
          <CardContent className="space-y-2">
            <h2 className="font-bold text-lg">Unterweisungen (lokal gespeichert)</h2>
            {entries.length === 0 && <p>Keine Einträge vorhanden.</p>}
            {entries.map((entry, idx) => (
              <div key={idx} className="border p-2 rounded">
                <p><strong>Name:</strong> {entry.name}</p>
                <p><strong>Score:</strong> {entry.score} / {entry.total}</p>
                <p><strong>Datum:</strong> {entry.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
