
export const USER_LOGIN_DATA='USER_LOGIN_DATA'

export function USER_DATA(data) {
  
  console.log(data)
return { type: USER_LOGIN_DATA, payload : data }
}    
