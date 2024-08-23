import {useState} from "react";
import ArticleEditor from "../../components/ArticleEditor/ArticleEditor";
import axios from "../../axios";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function CreateArticlePage () {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image_url: "",
    });
    console.log(formData)

    const {currentUser} = useSelector((state) => state.auth);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(    `/articles`, {...formData, author: currentUser.id})
            const data = await res.data;
            if (res.status === 200) {
                navigate(`/blog/${data}`)
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    return (
        <div>
            <ArticleEditor articleData={formData} setArticleData={setFormData} actionFunction={handleCreate} />
        </div>
    )
};

export default CreateArticlePage;