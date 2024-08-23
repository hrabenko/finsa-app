import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import './BlogPage.sass';
import axios from "../../axios";
import {useSelector} from "react-redux";

function BlogPage() {
    const [blogData, setBlogData] = useState([]);
    const {currentUser} = useSelector((state) => state.auth);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/articles`);
            const data = await res.data;
            if (res.status === 200) {
                setBlogData(data);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Щось пішло не так!';
            alert(errorMessage);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="blog-page">
            <h2 className="blog-title">Статті про фінанси</h2>
            <div className="articles">
                {Array.isArray(blogData) && blogData.map(item => (
                    <div key={item.id} className="article-card">
                        {item.image_url && <img className="image-cover" src={`${process.env.REACT_APP_SERVER_URL}${item.image_url}`} alt={item.title}/>}
                        <Link to={`/blog/${item.id}`}><h3 className="article-title">{item.title}</h3></Link>
                    </div>

                ))}
                {currentUser && currentUser.role === 'creator' &&
                    <Link className="create-article" to={'create'}>
                         Додати статтю
                    </Link>
                }
            </div>
        </div>
    );
}

export default BlogPage;
