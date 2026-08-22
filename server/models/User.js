const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255],
      is: /^[A-Za-z\s]+$/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // true for google auth
  },
  authProvider: {
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local'
  },
  resetPasswordToken: DataTypes.STRING,
  resetPasswordExpire: DataTypes.DATE,
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  otp: DataTypes.STRING,
  otpExpire: DataTypes.DATE,
  otpResendAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  otpLastResent: DataTypes.DATE,
  otpBlockedUntil: DataTypes.DATE,
  tempEmail: DataTypes.STRING,
  baseCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  emailVerificationToken: DataTypes.STRING,
  emailVerificationExpire: DataTypes.DATE
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    attributes: { exclude: ['password', 'otp', 'resetPasswordToken'] }
  },
  scopes: {
    withPassword: { attributes: {} }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.verifyPassword = async function(candidatePassword, { upgradeLegacy = false } = {}) {
  if (!isBcryptHash(this.password)) {
    const isMatch = this.password === candidatePassword;
    if (isMatch && upgradeLegacy) {
      this.password = candidatePassword;
      await this.save();
    }
    return isMatch;
  }
  return await this.comparePassword(candidatePassword);
};

User.prototype.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

User.prototype.getEmailVerificationToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

User.isBcryptHash = isBcryptHash;

module.exports = User;
