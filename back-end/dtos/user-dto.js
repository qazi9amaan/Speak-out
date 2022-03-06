class UserDto {
	id;
	phone;
	name;
	avatar;
	activated;
	createdAt;

	constructor(user) {
		this.id = user._id;
		this.phone = user.phone;
		this.avatar = user.avatar
			? `${process.env.BASE_URL}${user.avatar}`
			: null;

		this.activated = user.activated;
		this.createdAt = user.createdAt;
		this.name = user.name;
	}
}

module.exports = UserDto;
