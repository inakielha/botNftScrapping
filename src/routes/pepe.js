import {Router} from 'express'
import { allChats, deleteChat, newChat, updateGroup, userChat } from './chats'
// import { allGroups, deleteGroup, newGroup, updateGroup } from './groups'
import { allMessages, deleteMessages, deleteNotifications, messageChat, newMessage } from './messages'
import { allUsers, updateUsers, newUser, userById, lastConnection } from './user'

const router = Router()

//USERS
router.post('/users', async(req,res)=>{
    
})
router.put('/users', updateUsers)

export default router