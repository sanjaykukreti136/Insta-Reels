import { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import "./Videocard.css";
import { authContext } from "../AuthProvider";
import { logDOM } from "@testing-library/react";

let VideoCard = (props) => {
    let user = useContext(authContext);
    let [playing, setPlaying] = useState(false);
    let [commentBoxOpen, setCommentBoxOpen] = useState(false);
    let [currComment, setCurrComment] = useState("");
    let [comment, setComment] = useState([]);

    useEffect(() => {
        let f = async () => {
            let carr = props.data.comment;
            let arr = [];
            for (let i = 0; i < carr.length; i++) {
                let com = await firestore.collection("comments").doc(carr[i]).get();
                arr.push(com.data());
            }
            setComment(arr);
        }
        f();

    }, [props])


    return (
        <div className="video-card">
            <p className="video-card-username">{props.data.name}</p>
            <span className="video-card-music">
                <span class="material-icons">music_note</span>
                <marquee>some song</marquee>
            </span>

            <span onClick={() => {
                if (commentBoxOpen) {
                    setCommentBoxOpen(false);
                } else {
                    setCommentBoxOpen(true)
                }
            }} class="material-icons-outlined video-card-comment">chat</span>

            <span class="material-icons-outlined video-card-like"
                onClick={async () => {
                    let likesArr = props.data.like;
                    console.log(likesArr)
                    if (props.data.like.includes(user.uid)) {
                        likesArr = likesArr.filter((el) => {
                            return el != user.uid;
                        })
                        console.log(likesArr)
                        await firestore.collection("posts").doc(props.data.id).update({ like: likesArr })
                        console.log("unliked");
                    } else {
                        likesArr.push(user.uid);
                        console.log(likesArr)
                        await firestore.collection("posts").doc(props.data.id).update({ like: likesArr })
                        console.log("liked");
                    }
                }}
            >
                {props.data.like.includes(user.uid) ? "favorite" : "favorite_border"}

            </span>

            <video
                onClick={(e) => {
                    if (playing) {
                        e.currentTarget.pause();
                        setPlaying(false);
                    } else {
                        e.currentTarget.play();
                        setPlaying(true);
                    }
                }}
                loop
                src={props.data.url}
                className="video-card-video"
            ></video>
            {commentBoxOpen ? <div className="video-card-comment-box">
                <div className="actual-comments">
                    {comment.map((el) => {
                        return <div className="post-user-comments" >
                            <img src={el.photo} />
                            <div className="cuser">
                                <h6>{el.name}</h6>
                                <p>{el.comment}</p>
                            </div>
                        </div>


                    })}
                </div>
                <div className="comments-form">
                    <input type="text" value={currComment} onChange={(e) => {

                        setCurrComment(e.currentTarget.value)
                    }} />
                    <button onClick={async () => {

                        let comDoc = await firestore.collection("comments").add({ name: user.displayName, comment: currComment, photo: user.photoURL })
                        let com = await comDoc.get();
                        let comID = com.id;
                        let postDoc = await firestore.collection("posts").doc(props.data.id).get();
                        let postCom = postDoc.data().comment;
                        postCom.push(comID);
                        await firestore.collection("posts").doc(props.data.id).update({
                            comment: postCom
                        })
                        setCurrComment("");

                    }} >POST</button>
                </div>
            </div> : ""}


        </div>
    );
};

export default VideoCard;