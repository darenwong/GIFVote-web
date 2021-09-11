import React, {useContext, useState} from 'react';
const SignInContext = React.createContext();

export function useSignIn(){
  return useContext(SignInContext);
}

export function SignInProvider({children}){
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInMsg, setSignInMsg] = useState("");

  return (
    <SignInContext.Provider value={[signInOpen, setSignInOpen, signInMsg, setSignInMsg]}>
      {children}
    </SignInContext.Provider>
  )
}