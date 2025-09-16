import React from 'react'

interface UserLoginProps {
  title: string;
}

export const UserLogin: React.FC<UserLoginProps> = (props) => {

  return (
    <div className="my-16">
      UserLogin Block: {props.title}
    </div>
  )
}
