import {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ReactMde from "react-mde";
import { marked } from 'marked';
import './ArticleEditor.sass';
import "react-mde/lib/styles/css/react-mde-all.css";
import {useSelector} from "react-redux";
import axios from "../../axios";

function ArticleEditor({articleData, setArticleData, actionFunction}) {
    const navigate = useNavigate();
    const inputFileRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState("write");
    const [contentValue, setContentValue] = useState("");

    const {currentUser} = useSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser.role !== 'creator') {
            navigate("/blog")
        }

        setContentValue(articleData.content)
    }, []);

    useEffect(() => {
        setArticleData((prevState) => ({...prevState, content: contentValue}));
    }, [contentValue])

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Неправильний тип файлу. Будь ласка, завантажте зображення у форматі JPG або PNG.');
                return;
            }
            formData.append('image', file);
            const { data } = await axios.post('/upload', formData);
            console.log(data.url)
            setArticleData((prevState) => ({...prevState, image_url: data.url}));
        } catch (err) {
            console.warn(err);
            alert('Помилка при завантажені файлу');
        }
    };

    const onClickRemoveImage = async () => {
        try {
            const fileName = articleData.image_url.split('/').pop();
            await axios.delete('/delete', { data: { fileName } });
            setArticleData((prevState) => ({...prevState, image_url: ""}))
        } catch (err) {
            console.warn(err);
            alert('Помилка при видаленні файлу');
        }
    };

    const handleChange = (e) => {
        setArticleData((prevState) => ({...prevState, [e.target.id]: e.target.value}));
    }


    return (
        <div className="article-editor">
            <div className="editor-container">
                <div className="photo-block">
                    <button className="upload-image-btn" onClick={() => inputFileRef.current.click()}>
                        Завантажити
                    </button>
                    <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
                    {articleData.image_url && (
                        <>
                            <button className="remove-img-btn" onClick={onClickRemoveImage}>
                                Видалити
                            </button>
                            <img className="article-cover" src={`${process.env.REACT_APP_SERVER_URL}${articleData.image_url}`}
                                 alt="Uploaded"/>
                        </>
                    )}
                </div>
                <input id="title" onChange={handleChange}
                       value={articleData.title}
                       className="title-input" placeholder="Введіть заголовок..." type="text"/>
                <ReactMde
                    value={contentValue}
                    onChange={setContentValue}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    toolbarCommands={[['header', 'bold', 'italic', 'strikethrough'], ['link', 'quote', 'code'], ['unordered-list', 'ordered-list', 'checked-list']]}
                    minEditorHeight={500}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(marked.parse(markdown))
                    }
                />
                <div className="button">
                    <button className="btn-save" onClick={actionFunction}>Зберегти</button>
                </div>
            </div>
        </div>
    )
}

export default ArticleEditor;