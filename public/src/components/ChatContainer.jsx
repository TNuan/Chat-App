import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import Logout from './Logout'
import ChatInput from './ChatInput'
import axios from 'axios'
import { getAllMessageRoute, sendMessageRoute, updateMessageRoute } from '../utils/APIRoutes'
import { v4 as uuidv4 } from 'uuid'
import { CiMenuKebab } from 'react-icons/ci'
import { BsReply } from 'react-icons/bs'

export default function ChatContainer({currentChat, currentUser, socket}) {

  const [message, setMessage] = useState([])
  // const [arrivalMessage, setArrivalMessage] = useState(null)
  // const [updateMessage, setUpdateMessage] = useState(null)
  const scrollRef = useRef()

  useEffect(() => {(async () => {
    if(currentChat) {
      const response = await axios.post(getAllMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
      })
      setMessage(response.data)
    }
  })()}, [currentChat])


  const handleSendMsg = async (msg) => {  

    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    })
    
    const response = await axios.post(getAllMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
    })
    setMessage(response.data)
    
    socket.current.emit('send-msg', {
      from: currentUser._id,
      to: currentChat._id,
      // message: msg
    })
    // const msgs = [...message]
    // msgs.push({
    //   fromSelf: true,
    //   _removed: false,
    //   removedFromSelf: false,
    //   message: msg
    // })

  }

  const handleContextMenu = async (msg) => {
    const updatedMessage = {
      updatedMessageId: msg._id,
      fromSelf: msg.fromSelf
    }
    await axios.put(updateMessageRoute, updatedMessage)

    const response = await axios.post(getAllMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
    })
    setMessage(response.data)

    socket.current.emit('update-message', { 
      from: currentUser._id,
      to: currentChat._id 
    })
  }

  useEffect(() => {
    if(socket.current) {
      socket.current.on('msg-recieve', async (user) => {
        // setArrivalMessage({ 
        //   fromSelf: false, 
        //   _removed: false,
        //   removedFromSelf: false,
        //   message: msg  
        // })
        const response = await axios.post(getAllMessageRoute, {
          from: user.to,
          to: user.from,
        })
        setMessage(response.data)
      })
    }
  }, [])

  // useEffect(() => {
  //   arrivalMessage && setMessage((prev) => [...prev, arrivalMessage])
  // }, [arrivalMessage])


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: 'smooth' })
  }, [message])

  return (
    <>
    {
      currentChat && (
        <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
          <Logout />
        </div>
        <div className="chat-message">
        {
          message.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div className={`message ${message.fromSelf ? 'sended' : 'recieved'} ${message.removed ? 'removed':''}`} >
                    <div >
                        <BsReply/>
                    </div>
                    {
                      !message._removed && <div className='menu-icon'>
                        <CiMenuKebab onClick={(e) => {  
                          if (document.querySelector('.show-menu')) {
                            document.querySelector('.show-menu').classList.remove('show-menu')
                          }
                          e.target.classList.add('show-menu')
                        }}/>
                        <div className='context-menu'>
                          <ul>
                              <li onClick={() => { 
                                document.querySelector('.show-menu').classList.remove('show-menu')
                                handleContextMenu(message)
                              }}>remove</li>
                              <li>reply</li>
                              <li>forward</li>
                            </ul>
                        </div>
                      </div>
                    }
                    <div className={`content ${message._removed ? 'removed' : ''}`}>
                      <p>
                        {
                          message._removed? 'this message was removed' : message.message
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
        }
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
      )
    }
    </>  
  )
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-message {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;
      svg {
        cursor: pointer;
        visibility: hidden;
        font-size: 1.3rem;
        color: #ebe7ff;
        transition: all 0.1s ease-in-out;
      }
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
      .content.removed {
        color: #6B7174;
        font-size: 0.8rem;
        font-style: italic;
      }
      .menu-icon {
        position: relative;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .context-menu {
          z-index: 100;
          background-color: #413571;
          width: 100px;
          border-radius: 12px;
          color: #ffff;
          overflow: hidden;
          position: absolute;
          top: 0;
          visibility: hidden;
          ul {
            li {
              cursor: pointer;
              list-style: none;
              padding: 0.5rem 0.5rem;
              font-size: 1rem;
              color: #d1d1d1;
              &:hover {
                color: #ffff;
                background-color: #9a86f3;
              }
            }
          }
        }
        .show-menu + .context-menu{
          visibility: visible;
        }
      }
    }
    .message:hover svg {
      visibility: visible;
    }

    .sended {
      justify-content: flex-end;
      svg {
        transform: scaleX(-1);
        -moz-transform: scaleX(-1);
        -webkit-transform: scaleX(-1);
        -ms-transform: scaleX(-1);
      }
      .context-menu {
        right: 0;
      }
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-end;
      flex-direction: row-reverse;
      .context-menu {
        left: 0;
      }
      .content {
        background-color: #9900ff20;
      }
    }
  }
`
