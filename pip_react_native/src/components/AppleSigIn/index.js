import React, { useState, useEffect } from 'react';
import { AppRegistry, StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import { NetworkManager, Utility, NavUtil } from "../../utils";
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../../res';
const { width, height } = Dimensions.get("window");

console.log("dsadas",appleAuth.isSignUpButtonSupported);

// async function onAppleButtonPress() {
//   // sign in request
//   const responseObject = await appleAuth.performRequest({
//     requestedOperation: AppleAuthRequestOperation.LOGIN,
//     requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
//   });

//   //authorization state request
//   const credentialState = await appleAuth.getCredentialStateForUser(responseObject.user);

//   if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
//     //user is authorized
//   }
// }


async function onAppleButtonPress() {
  // performs login request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  const { identityToken, nonce, fullName, authorizationCode, user } = appleAuthRequestResponse;
  // get current authentication state for user
  // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

  // use credentialState response to ensure the user is authenticated
  if (credentialState === appleAuth.State.AUTHORIZED && identityToken) {
    // user is authenticated
    console.log("Apple user Authenticated===>>>" + JSON.stringify(appleAuthRequestResponse))

    let requestBody = {};
    requestBody["socialId"] = user,
    requestBody["meta"] = appleAuthRequestResponse

    NetworkManager.networkManagerInstance.fetchRequest(URL.appleLogin, URL.postRequest, true, requestBody)     
    .then((res) => {

      console.log('socialLoginApiCall response' + JSON.stringify(res)) 
      this.handleResponse(res, requestBody, true)
    }).catch((error) => {
       
    })
   
  }




    //  appleLogin
}

handleResponse()
{

 
}


async function onLogoutPress() {
  //logout request
  const responseObject = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGOUT,
  });
}

function AppleSigninComponent() {
  return (
    <View style={[styles.horizontal]}>
      <AppleButton
        style={styles.appleButton}
        cornerRadius={25}
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={() => onAppleButtonPress()}
      />
      
    </View>
  );
}

export default AppleSigninComponent;

const styles = StyleSheet.create({

  horizontal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  appleButton: {
    width: width - 50,
    height: 50,
    margin: 0,
  },
})
// appleAuthRequestResponse {authorizedScopes: Array(0), identityToken: "eyJraWQiOiJBSURPUEsxIiwiYWxnIjoiUlMyNTYifQ.eyJpc3M…sDJMy_4_4jS9IIhm_1wUsQlgFdoNOlGYWdaZ3Tr3o-ddXc43A", authorizationCode: "cdbed5846b2ea4742bd5ad9773f6c114b.0.nryuv.8L1JV_dnuM3-MR8q6RAu-Q", realUserStatus: 2, nonce: "mgJelTJ8s4_.9l74z2FBsK.6muPI9.Ix", …}authorizedScopes: []identityToken: "eyJraWQiOiJBSURPUEsxIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmVqb2JiaW5nIiwiZXhwIjoxNTc5MDA4NDg2LCJpYXQiOjE1NzkwMDc4ODYsInN1YiI6IjAwMTg0NS41ODhlYzliYmIyMDA0MWNkYjAwNzIxMzdkN2VmMmM2My4xMzE4Iiwibm9uY2UiOiIyYjg0N2YyZGIyMDk4YTkxYTc1MzUyMGEzNzYxNWI0NDNmMzQwNjAxZGZhZjU2YTU0MjIwZTliOWYxMzdhN2YzIiwiY19oYXNoIjoibHhKUGpJZHdvY2JING1KQWhKV3lZQSIsImVtYWlsIjoiang3bXR1NzN0eEBwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJpc19wcml2YXRlX2VtYWlsIjoidHJ1ZSIsImF1dGhfdGltZSI6MTU3OTAwNzg4Nn0.g0gbXupmLtI5hsWN8VAwm9c8E6ZppaMoiq9De3V4_5Zb3MHfjNYAaiu6CQt4CL-ZTZZ9Vq8wMF9hkonuPWwS31HCz4N2w0FlUU9fcZEBrzr1rAlkEjVTQ1SX7snAWQPjZ0Flu54SVcY4Q5HTWVLM1iil49rKx033KqhjsXt8BQBuc6Is1j0zXqQVQHR7fzEHCKbyxUL3IdY-Hm3z43eReSdl0sl7UlWDr1y5hpQ1EdN8CQA-bufLLIhCzbBDvNAn8bSnJdEY1cYTQkdtrY5Mct1As_3-_pHNkBHStsDJMy_4_4jS9IIhm_1wUsQlgFdoNOlGYWdaZ3Tr3o-ddXc43A"authorizationCode: "cdbed5846b2ea4742bd5ad9773f6c114b.0.nryuv.8L1JV_dnuM3-MR8q6RAu-Q"realUserStatus: 2nonce: "mgJelTJ8s4_.9l74z2FBsK.6muPI9.Ix"fullName: {namePrefix: null, givenName: "Rahul", nameSuffix: null, nickname: null, familyName: "Bajaj", …}email: "jx7mtu73tx@privaterelay.appleid.com"state: nulluser: "001845.588ec9bbb20041cdb0072137d7ef2c63.1318"__proto__: Object
// index.bundle?platfor…&minify=false:95650 mgJelTJ8s4_.9l74z2FBsK.6muPI9.Ix eyJraWQiOiJBSURPUEsxIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmVqb2JiaW5nIiwiZXhwIjoxNTc5MDA4NDg2LCJpYXQiOjE1NzkwMDc4ODYsInN1YiI6IjAwMTg0NS41ODhlYzliYmIyMDA0MWNkYjAwNzIxMzdkN2VmMmM2My4xMzE4Iiwibm9uY2UiOiIyYjg0N2YyZGIyMDk4YTkxYTc1MzUyMGEzNzYxNWI0NDNmMzQwNjAxZGZhZjU2YTU0MjIwZTliOWYxMzdhN2YzIiwiY19oYXNoIjoibHhKUGpJZHdvY2JING1KQWhKV3lZQSIsImVtYWlsIjoiang3bXR1NzN0eEBwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJpc19wcml2YXRlX2VtYWlsIjoidHJ1ZSIsImF1dGhfdGltZSI6MTU3OTAwNzg4Nn0.g0gbXupmLtI5hsWN8VAwm9c8E6ZppaMoiq9De3V4_5Zb3MHfjNYAaiu6CQt4CL-ZTZZ9Vq8wMF9hkonuPWwS31HCz4N2w0FlUU9fcZEBrzr1rAlkEjVTQ1SX7snAWQPjZ0Flu54SVcY4Q5HTWVLM1iil49rKx033KqhjsXt8BQBuc6Is1j0zXqQVQHR7fzEHCKbyxUL3IdY-Hm3z43eReSdl0sl7UlWDr1y5hpQ1EdN8CQA-bufLLIhCzbBDvNAn8bSnJdEY1cYTQkdtrY5Mct1As_3-_pHNkBHStsDJMy_4_4jS9IIhm_1wUsQlgFdoNOlGYWdaZ3Tr3o-ddXc43A
// index.bundle?platfor…&minify=false:95654 I'm a real person!