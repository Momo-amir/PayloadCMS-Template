import React from 'react'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

interface {{BLOCK}}Props {
  title: string;
}

export const {{BLOCK}}: React.FC<{{BLOCK}}Props> = (props) => {

  return (
    <div className="my-16">
      <TrackImpression
        componentName="{{BLOCK}}"
        componentType="{{BLOCK}}"
      >
        {{BLOCK}} Block: {props.title}
      </TrackImpression>
    </div>
  )
}
