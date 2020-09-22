const { User } = require('../models')
const user = require('../models/user')
const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server') 

module.exports = {
Query: {
    getUsers: async () => {
      try{
          const users = await User.findAll()
          return users
      }catch(err){
          console.log(err)
      }
    },
  },
  Mutation: {
      register: async (_, args) => {
            let { username, email, password, confirmPassword } =  args
            let errors = {}
            try{
                // TODO: validate input data 

                if(username.trim() === '') errors.username = "username must not be empty"
                if(email.trim() === '') errors.email = "email must not be empty"
                if(password.trim() === '') errors.password = "password must not be empty"
                if(confirmPassword.trim() === '') errors.confirmPassword = "confirmation password must not be empty"

                // chack if username / email exists 

                const userName = await User.findOne({where : {username}})
                const emailConf = await User.findOne({where : {email}})

                if(userName) errors.username = 'username already taken'
                if(emailConf) errors.email = 'email already taken'

                // check if the email is valid
                if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) errors.email = 'email is not valid'

                // check if the passwords are identical
                if(password !== confirmPassword) errors.password = ' password are not identical'
        
                // check if the errors object contains at least one key meaning one value (error)
                if(Object.keys(errors).length > 0){
                    throw errors
                }

                // TODO: hash the password
                password = await bcrypt.hash(password, 6)

                // create the user 
                const user = await User.create({
                    username, email, password
                })

                return user
                
            }catch(err){
                throw new UserInputError('bad input', {errors: err})
            }
      }
  }
}