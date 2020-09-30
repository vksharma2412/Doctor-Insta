import Toast from 'react-native-simple-toast';
import { Platform } from 'react-native'
import AsyncStorage from "@react-native-community/async-storage";
import Constants from '../../res/Constants';
import String from '../../res/String';

export default class Session {
    static sharedInstance = Session.sharedInstance == null ? new Session() : Session.sharedInstance;
    id = undefined
    token = undefined
    name = undefined
    email = undefined
    education = undefined
    imageUrl = undefined
    isTutor = undefined
    countryCode = undefined
    userDetails = undefined
    countryName = undefined
    countryCodeObj = undefined
    isStudent = true
    isTutorPersonalDetails = false
    isTutorBusninessInfo = false
    isTutorQualification = false
}