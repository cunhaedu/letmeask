import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      toast('Por favor, Digite uma pergunta válida!')
      return;
    }

    if (!user) {
      toast('Você deve estar logado!');
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    }

    toast.promise(database.ref(`rooms/${roomId}/questions`).push(question).then(), {
      loading: 'Salvando questão...',
      success: 'Questão salva com sucesso!',
      error: 'Erro ao salvar questão'
    })

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined >Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question key={question.id} content={question.content} author={question.author} />
            )
          })}
        </div>
      </main>
    </div>
  )
}
