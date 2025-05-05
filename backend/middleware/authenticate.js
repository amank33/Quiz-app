import jwt from 'jsonwebtoken'
export const authenticate1 = async (req, res, next) => {

    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies["refresh_token"];
    try {
        

        if (!access_token) {
            throw new Error('No access token provided');
        }
        const user = jwt.verify(accessToken, process.env.JWT_SECRET)
        if(!user) {
            throw new Error('Invalid token provided');
        }
        req.user = user
        
    } catch (error) {
        try{
        const user = jwt.verify(refreshToken, process.env.JWT_SECRET)
        if(!user) {
            throw new Error('Invalid refresh token provided');
        }
        req.user = user;
        const accessTokenNew = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('access_token', accessTokenNew, {
            httpOnly: true
        })
        
      }
       catch(error){
        res.status(403).json({ status: false, message: 'Unauthorized', error:error.message })
       }
    }
    next()


        // res.status(403).json({ status: false, message: 'Unauthorized' })
 }
 export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        if (!token) {
            return res.status(403).json({ status: false, message: 'Unauthorized' })
        }
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        res.status(403).json({ status: false, message: 'Unauthorized' })
    }
}
