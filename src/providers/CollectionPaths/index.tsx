'use client'

import React, { createContext, useContext } from 'react'

type CollectionPathsContextType = {
  postsBasePath: string
}

const CollectionPathsContext = createContext<CollectionPathsContextType>({
  postsBasePath: '/posts',
})

export const CollectionPathsProvider: React.FC<{
  postsBasePath: string
  children: React.ReactNode
}> = ({ postsBasePath, children }) => (
  <CollectionPathsContext.Provider value={{ postsBasePath }}>
    {children}
  </CollectionPathsContext.Provider>
)

export const useCollectionPaths = () => useContext(CollectionPathsContext)
