'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.asyncHandler = void 0
const asyncHandler = (asyncFn) => (req, res, next) => {
  asyncFn(req, res, next).catch(next)
}
exports.asyncHandler = asyncHandler
// # sourceMappingURL=asyncHandler.js.map
