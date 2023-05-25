'use strict'
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator.throw(value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.protect = exports.restrictTo = void 0
const passport = require('passport')
const passport_jwt_1 = require('passport-jwt')
const AppError_1 = require('./utils/AppError')
passport.use(new passport_jwt_1.Strategy({
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(process.env.SECRET_KEY)
}, (token, done) => __awaiter(void 0, void 0, void 0, function * () {
  try {
    return done(null, token.user)
  } catch (error) {
    return done(error)
  }
})))
const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) { return next(new AppError_1.AppError('You do not have access to perform this action', 403)) }
  next()
}
exports.restrictTo = restrictTo
exports.protect = passport.authenticate('jwt', { session: false })
// # sourceMappingURL=authenticate.js.map
