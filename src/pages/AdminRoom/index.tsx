import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

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

  async function handleCheckQuestionAsAnswered(questionId: string) {
    toast.promise(database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    }).then(), {
      loading: 'Marcando pergunta como respondida...',
      success: <b>🥳 Pergunta marcada como respondida!</b>,
      error: <b>😥 Não foi possível marcar a pergunta como respondida.</b>,
     });
  }

  async function handleHighlightQuestion(questionId: string) {
    toast.promise(database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    }).then(), {
      loading: 'Marcando pergunta como respondida...',
      success: <b>Pergunta destacada!</b>,
      error: <b>Não foi possível destacar a pergunta.</b>,
     });
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
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                  <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)} >
                    <img src={checkImg} alt="marcar pergunta como respondida" />
                  </button>

                  <button type="button" onClick={() => handleHighlightQuestion(question.id)} >
                    <img src={answerImg} alt="dar destaque a pergunta" />
                  </button>
                </>
                )}

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
