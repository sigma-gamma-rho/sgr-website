// Dependencies
var mongoose  = require('mongoose'),
		Schema    = mongoose.Schema,
		bcrypt 	 = require('bcrypt-nodejs');

// user schema
var UserSchema   = new Schema({
	name: { type: String, 	required: true },
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false},
	admin: { type: Boolean, default: false },
	picture: { type: String, required: true, default: 'default.jpg'},
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {

	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

// export the module
var User = mongoose.model('User', UserSchema);
module.exports = User;
