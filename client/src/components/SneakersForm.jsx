import React, {useState} from "react"

const initInputs = {
    title: "",
    description: "",
    img:"",
    comment:""
}

export default function SneakersForm(props) {

    const [inputs, setInputs] = useState(initInputs)

    const {submit, btnText, _id} = props
    function handleChange(e){
        const {name, value} = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }
    function handleSubmit(e){
        e.preventDefault()
        submit(inputs, _id)
        setInputs(initInputs)
        }


        const {title, description, img} = inputs
    return (
        <form onSubmit={handleSubmit}>
            <input 
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Title"/>
            <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Description"/>
            <input 
            type="text"
            name="img"
            value={img}
            onChange={handleChange}
            placeholder="Image"/>
            <button>{btnText}</button>
        </form>
    )
}