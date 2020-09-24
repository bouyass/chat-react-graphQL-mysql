const { UserInputError, AuthenticationError } = require('apollo-server') 
const { User, Message } = require('../../models/')
const { Op } = require('sequelize')

module.exports = {
    Query:{
        getMessages: async (_, { from }, { user }) => {
            try{
                // chack if the user is authenticated 
                if(!user) throw new AuthenticationError('Unauthenticated')

                // check if the user exist 
                const otherUser = await User.findOne({where: {username:from}})
                if(!otherUser) throw new UserInputError('User not found')

                const usernames = [user.username, otherUser.username]

                const messages = Message.findAll({
                    where: {
                        from: { [Op.in]: usernames },
                        to: { [ Op.in]: usernames}
                    },
                    order: [['createdAt', 'DESC']]
                }
                )
                return messages

            }catch(err){
                throw new AuthenticationError('the user is not authenticated')
            }
        }
    },
    Mutation: {
      createMessage: async (parent, { to, content}, { user }) => {
        try{
            // chack if the user is authenticated 
            if(!user) throw new AuthenticationError('Unauthenticated')

            // check if the recipient user exist in db
            const recipient = await User.findOne({where: {username:to}})
            if(!recipient) throw new UserInputError('The destination user doesnt exist')
            
            // check if the recipient is not the sender  
            if(recipient.username === user.username) throw new UserInputError('you can not message yourself')

            // check if the content is not empty 
            if(content.trim() === '') throw new UserInputError('the content must not be empty')

            // create a message
            const message = await Message.create({
               from: user.username,
               to,
               content
            })

            return message

        }catch(err){
            console.log(err)
            throw err
        }
      }
  }
}