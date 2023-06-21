import React, {useContext, useState} from "react"
import { UserContext } from "../../context/UserProvider";
import Comments from "./Comments";

export default  function  Sneakers(props) {
    const {sneaker} = props

    const {title, img, _id, description, likes, user: sneakerUser } = sneaker
    const initInputs = {
        title: title,
        description: description,
        img: img,
    }
    const initCommentInputs = {
      content: ""
    }
 
    const [inputs, setInputs] = useState(initInputs)
    const {deleteUserSneakers, deleteComment, editComment, editedUserSneakers, likeSneakers, dislikeSneakers, comments, user, addComment } = useContext(UserContext)
    const [userSneakers, setUserSneakers] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [commentInputs, setCommentInputs] = useState(initCommentInputs)
    const [commentToggle, setCommentToggle] = useState(false)
    
    const filteredComments = comments.filter(comment => _id === comment.sneaker) 

    const handleEdit = () => {
        setIsEditing(true);
      };
     function handleEditComment(_id) {
      editComment(_id)
      
      }
      const handleSave = () => {
        editedUserSneakers(_id, inputs)
          setIsEditing(false);
      };
      function handleChangeComment(e) {
        const { name, value } = e.target;
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: value
          
        }));
        setCommentInputs((prevInputs) => ({
          ...prevInputs,
          [name]: value
        }));
      }
      function handleRemoveComment(_id) {
        deleteComment(_id);
      }

      function handleAddComment(e) {
        e.preventDefault()
        addComment(commentInputs, _id)
        setCommentInputs(initCommentInputs)
        setCommentToggle(false)
      }
      function handleChange(e){
        console.log(inputs)
        const {name, value} = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

      return (
        <div className="sneakers-container">
          {isEditing ? (
  <div>
    <input
      type="text"
      name="title"
      value={inputs.title}
      onChange={handleChange}
      placeholder="Title"
    />
    <input
      type="text"
      name="description"
      value={inputs.description}
      onChange={handleChange}
      placeholder="Description"
    />
    <input
      type="text"
      name="img"
      value={inputs.img}
      onChange={handleChange}
      placeholder="Image"
    />
    <button onClick={handleSave}>Save</button>
    {filteredComments.map((c) => {
      return <Comments 
        content={c.content}
      />
    })}
  </div>
) :
          (
            <div>
              <h1 className="title">{title}</h1>
              <h3 className="description">{description}</h3>
              <div className="image-wrapper"><img src={img} alt={title} />
              </div>
              
                <p>like: {likes?.length}</p>
                {filteredComments.map(comment => {
                  return(
                    <Comments 
                      key={comment._id} 
                      content = {comment.content}
                      commentUser = {comment}
                      userId = {user._id}
                      handleDelete = {handleRemoveComment}
                      commentId={comment._id}
                      handleEdit={handleEditComment}
                    />
                  )
                })}
                <div className="button-container">
                <button className="shoe-btn"
                onClick={() => likeSneakers(_id)}disabled={userSneakers === "upvote"}>
                  Like
                </button>
                <button className="shoe-btn"
                  onClick={() => dislikeSneakers(_id)}
                  disabled={userSneakers === "downvote"}
                >
                  Dislike
                </button>
                {sneakerUser === user._id && <> 
                  <button  className="shoe-btn" onClick={() => deleteUserSneakers(_id)}>Delete</button>
                  <button  className="shoe-btn" onClick={() => handleEdit()}>Edit</button>
                </>}
               {!commentToggle && <>
                  <button onClick={() => setCommentToggle(true)}>Add Comment</button>
                </>}
                {commentToggle && <>
                  <form onSubmit={handleAddComment}> 
                    <textarea 
                      type="text"
                      name="content"
                      value={commentInputs.content}
                      onChange={handleChangeComment}
                      placeholder="Comment"
                    />
                    <p><button >Add Comment</button></p>
                  </form>
                </>}
              </div>
            
            </div>
          )}
        </div>
      );
          }