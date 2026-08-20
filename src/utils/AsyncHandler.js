const asyncHandler = (requesthandler) => {
    (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}


// ANOTHER WAY-->
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             sucess: false,
//             message: error.message
//         })
//     }
// }