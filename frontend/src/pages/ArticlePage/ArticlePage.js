import {useEffect, useState} from "react";
import './ArticlePage.sass'
import { marked } from 'marked';
import {useNavigate, useParams} from "react-router-dom";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import {useSelector} from "react-redux";
import axios from "../../axios";
import ArticleEditor from "../../components/ArticleEditor/ArticleEditor";

function ArticlePage() {
    const params = useParams();
    const navigate = useNavigate();
    const {currentUser} = useSelector((state) => state.auth);

    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [articleData, setArticleData] = useState({
        title: "",
        content: "",
        image_url: ""
    })

    const fetchData = async () => {
        try {
            const res = await axios.get(`/articles/${params.id}`);
            const data = await res.data;
            if (res.status === 200) {
                setArticleData(data[0]);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdate = async () => {
        try {
            const res = await axios.post(`/articles/${params.id}`, articleData);
            const data = await res.data;
            if (res.status === 200) {
                setIsEditing(false)
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`/articles/${params.id}`);
            const fileName = articleData.image_url.split('/').pop();
            await axios.delete('/delete', { data: { fileName } });
            const data = await res.data;
            if (res.status === 200) {
                setModal(false);
                navigate("/blog")
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }



    return (
        <div className="article">
            {isEditing
            ? <ArticleEditor articleData={articleData} setArticleData={setArticleData} actionFunction={handleUpdate} />
            : articleData && (<>
                    <img className="article-cover" src={`${process.env.REACT_APP_SERVER_URL}${articleData.image_url}`} />
                    <h2 className="article-title">{articleData.title}</h2>
                    <div
                        className="text-content"
                        dangerouslySetInnerHTML={{__html: marked.parse(articleData.content)}}></div>

                    {currentUser && currentUser.role === 'creator' &&
                        <div className="buttons">
                            <button onClick={() => setIsEditing(true)} className="btn btn-edit">Редагувати</button>
                            <button onClick={() => setModal(true)} className="btn btn-delete">Видалити</button>
                        </div>}
                </>)}
            {modal && (
                <ModalWindow textContent="Ви дійсно бажаєте видалити статтю?"
                             handleFunction={handleDelete}
                             setModal={setModal}
                />
            )}
        </div>
    )
}

export default ArticlePage;