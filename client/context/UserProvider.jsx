import React, {useState, useEffect} from "react"
import axios from "axios"

export const UserContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})


export default function UserProvider(props){
    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {}, 
        token: localStorage.getItem("token") || "" , 
        sneakers:[],
        errMsg: ""
    }

    const [userState, setUserState] = useState(initState)
    const [allSneakers, setAllSneakers] = useState([])
    const [comments, setComments] = useState([])


    function signup(credentials){
        axios.post("/auth/signup", credentials)
        .then(res =>  { 
            const {user, token} = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }))
        })
        .catch(err => handleAuthErr(err.response.data.errMsg))
    }
    function login(credentials){
        axios.post("/auth/login", credentials)
        .then(res => {
            const {user, token} = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            getUserSneakers()
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }))
        })
        .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user:{},
            token: "",
            sneakers:[]
        })
    }

    function handleAuthErr(errMsg){
        setUserState(prevState => ({
            ...prevState, 
            errMsg
        }))
    }

    function resetAuthErr(){
        setUserState(prevState => ({
            ...prevState,
            errMsg: ""
        }))
    }
    function getUserSneakers(){
        userAxios.get("/api/sneakers/user")
        .then(res =>  {
            setUserState(prevState => ({
                ...prevState,
                sneakers: res.data
            }))
        })
        .catch(err => console.log(err.response.data.errMsg))
    }
  
    function getAllSneakers() {
        userAxios.get("/api/sneakers")
        .then(res => {
            setAllSneakers(res.data)
        })
        .catch(err => console.log(err.response.data.errMsg))
    }
    

    useEffect(()=> {
      getAllSneakers()
      getAllComments()
    }, [])

function addSneakers(newSneakers) {
    userAxios
      .post('/api/sneakers', newSneakers)
      .then((res) => {
        setUserState((prevState) => ({
          ...prevState,
          sneakers: [...prevState.sneakers, res.data],
        }));
      })
      .catch((err) => console.log(err));
  } 
  function deleteUserSneakers(sneakersId) {
    userAxios.delete(`/api/sneakers/${sneakersId}`)
    .then(res => console.log(res))
    getUserSneakers()
  }
  function editedUserSneakers(sneakersId, updatedSneakers) {
    userAxios
      .put(`/api/sneakers/${sneakersId}`, updatedSneakers, {
        headers: { 
            "Authorization":`Bearer ${initState.token}`
        }
    })
      .then(res => {
          console.log("Sneakers updated successfully!");
          setUserState(prevState => ({
              ...prevState,
              sneakers: [...prevState.sneakers.map(sneaker => {
                return sneakersId !== sneaker._id ? sneaker : res.data
              })]
            }))
          setAllSneakers(prevState => {
            return prevState.map(sneaker =>  sneakersId !== sneaker._id ? sneaker : res.data)
          })
            console.log(res.data)
        })
        .catch((error) => {
            console.log("Error updating sneakers:", error);
        });
        console.log(updatedSneakers, "updatedSneakers")
        console.log(sneakersId, "sneakersId")
    }
    function likeSneakers(sneakersId) {
      userAxios
        .put(`/api/sneakers/like/${sneakersId}`)
        .then((res) => {
          setUserState((prevState) => ({
            ...prevState,
            sneakers: prevState.sneakers.map((sneakers) => {
              if (sneakers._id === sneakersId) {
                return {
                  ...sneakers,
                  likes: res.data,
                };
              }
              return sneakers;
            }),
          }));
          setAllSneakers(prevSneakers => prevSneakers.map(sneaker => sneakersId !== sneaker._id ? sneaker : {...sneaker, likes: res.data}))

        })
        .catch((err) => console.log(err));
    }
  function dislikeSneakers(sneakersId) {
    userAxios
      .put(`/api/sneakers/unlike/${sneakersId}`)
      .then((res) => {
        setUserState((prevState) => ({
          ...prevState,
          sneakers: prevState.sneakers.map((sneakers) => {
            if (sneakers._id === sneakersId) {
              return {
                ...sneakers,
                likes: res.data,
              };
            }
            return sneakers;
          }),
        }));
        setAllSneakers(prevSneakers => prevSneakers.map(sneaker => sneakersId !== sneaker._id ? sneaker : {...sneaker, likes: res.data}))
      })
      .catch((err) => console.log(err));
  }
function getAllComments() {
  axios.get("/api/comment")
  .then(res => {
    setComments(res.data)
  })
  .catch(err => console.log(err.response.data.errMsg))
}
function getCommentsById(commentId) {
  axios.get(`/api/comment/${commentId}`)
  .then((response) => response.data)
    .catch((err) => console.log(err));
}
function addComment(newComment, commentId) {
  userAxios
    .post(`/api/comment/${commentId}`, newComment)
    .then((res) => {
      setComments((prevState) => ([
        ...prevState,
        res.data
      ]));
    })
    .catch((err) => console.log(err));
}
function editComment(commentId, updatedComment) {
  console.log("updatedComment: ", updatedComment)
userAxios.put(`/api/comment/${commentId}`, updatedComment)
.then(res => {
  console.log(res.data)
  setComments(prevState => prevState.map(comment => commentId !== comment._id ? comment : res.data))
})
.catch(err => console.log(err))
}
function deleteComment(commentId) {
  userAxios.delete(`/api/comment/${commentId}`)
    .then(() => {
      setComments(prevComments => prevComments.filter(comment => commentId !== comment._id));
    })
    .catch(err => console.log(err));
}
    return (
        <UserContext.Provider
        value={{
            ...userState,
            comments,
            signup,
            login,
            logout,
            resetAuthErr,
            getUserSneakers,
            getAllSneakers,
            allSneakers,
            addSneakers,
            deleteUserSneakers,
            editedUserSneakers,
            likeSneakers,
            dislikeSneakers,
            getAllComments,
            deleteComment,
            addComment,
            editComment
        }}>
            {props.children}
        </UserContext.Provider>
    )
}
