#CodeConnect API

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:userId
- POST /request/send/rejected/:userId

userRouter

- GET/user/connections
- GET /requests/received
- GET /feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepted, rejected