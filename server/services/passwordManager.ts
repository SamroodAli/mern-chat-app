import bcyrpt from "bcrypt";

export class PasswordManager {
  static hashPassword(password: string) {
    const salt = bcyrpt.genSaltSync();
    const hashedPassword = bcyrpt.hashSync(password, salt);
    return hashedPassword;
  }
  static comparePassword(userPassword: string, dbPassword: string) {
    return bcyrpt.compareSync(userPassword, dbPassword);
  }
}
