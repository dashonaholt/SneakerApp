import React, {useContext, useState, useEffect} from "react"
import { UserContext } from "../../context/UserProvider";

export default function Comments(props) {
    const initCommentInputs = {
        content: ""
    }
    const {content, userId, commentUser, commentId, handleDelete} = props 
    const {comments, editComment } = useContext(UserContext)
    const [updatedContent, setContent] = useState({ content: content || ""});
    const [editingCommentId, setEditingCommentId] = useState(false); 
    const [commentInputs, setCommentInputs] = useState(initCommentInputs) 
    const [formToggle, setFormToggle] = useState(true) 


    function handleChangeComment(e) {
        const { name, value } = e.target;
        setContent((prevInputs) => ({
            ...prevInputs,
            [name]: value 
    }))}
    const handleEditComment = () => {
        editComment(commentId, updatedContent)
        setFormToggle(true)
      };
      console.log(comments)
      return (
        <div>
          {formToggle && (
            <>
              <h1 className="comment-user">User {commentUser.username} : <span className="comment-content">{content}</span></h1>
              {(userId === commentUser.user._id || userId === commentUser.user) && (
                <>
                  <button onClick={() => setFormToggle(false)}>Edit</button>
                  <button onClick={() => handleDelete(commentId)}>Delete</button>
                </>
              )}
            </>
          )}
          {!formToggle && (
            <>
              <input
                type="text"
                name="content"
                value={updatedContent.content}
                onChange={handleChangeComment}
                placeholder="Comment"
              />
              <button onClick={handleEditComment}>Save</button>
            </>
          )}
        </div>
      );
      
}
