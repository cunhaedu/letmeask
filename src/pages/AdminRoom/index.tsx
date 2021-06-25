import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';

import '../../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();

  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    toast.promise(database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    }).then(), {
      loading: 'Encerrando sala...',
      success: <b>Sala encerrada com sucesso!</b>,
      error: <b>Não foi possível encerrar a sala.</b>,
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
       toast.promise(database.ref(`rooms/${roomId}/questions/${questionId}`).remove().then(), {
        loading: 'Removendo pergunta...',
        success: <b>Pergunta removida com sucesso!</b>,
        error: <b>Não foi possível remover a pergunta.</b>,
       });
    }
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
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
              <Question key={question.id} content={question.content} author={question.author}>
                <button type="button" onClick={() => handleDeleteQuestion(question.id)} >
                  <img src={deleteImg} alt="remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
