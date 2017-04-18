var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, unique: true },
    hashed_password: String,
    email: String,
    favorites: [
        {
            author: String,
            title: String,
            description: String,
            url: String,
            urlToImage: String,
            publishedAt: String
        }
    ],
});
mongoose.model('User', UserSchema);