import React from 'react'

interface {{BLOCK}}Props {
  title: string;
}

export const {{BLOCK}}: React.FC<{{BLOCK}}Props> = (props) => {

  return (
    <div className="my-16">
      {{BLOCK}} Block: {props.title}
    </div>
  )
}
