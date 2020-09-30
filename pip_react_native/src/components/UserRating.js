import React from 'react'
import {
    StyleSheet,
    View,
} from 'react-native'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Color, Assets } from '../../res'
 const UserRating = props => {
    const {
        defaultRating,
        count,
        onratingCompleted

    } = props;
   
        return (
                <AirbnbRating
                defaultRating= {defaultRating}
                count ={count}
                selectedColor='#f1c40f'
                showRating= {false}
                isDisabled={false}
                onFinishRating={onratingCompleted}
                starStyle={{height: 52,width: 55}}
                />
          
        );
    
}
 export default UserRating;

const styles = StyleSheet.create({
    container: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    textStyle: {
        fontSize: 16
    }
});
