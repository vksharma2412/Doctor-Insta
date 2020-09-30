import React from 'react'
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';



import {
    LandingScreen,
    BusinessRegistration,
    PartnerInformation,
    TrackApplication,
    IntroScreen,
    Login,
    StudentRegistration,
    TutorRegistration,
    TutorBusinessInfo,
    TutorQualification,
    VerifyOtp,
    UserTypeScreen,
    InitialRoute,
    HomeScreen,
    SuccessScreen,
    BidsRecieved,
    SessionDetailScreen,
    CancellationReasonScreen,
    BookSession,
    //  RequestSession,
    BookASession,
    SlotBooking,
    MyTutor,
    CustomerCare,
    SessionCancelScreen,
    ActiveSessionsList,
    ScheduledSessionsList,
    BidList,

    Settings,
    ReferAppScreen,
    PdfScreen,
    PrivacyPolicyScreen,
    ContactUsScreen,
    FAQsScreen,
    AgreementandDisclaimerScreen,
    RateTutorScreen,
    RaiseDisputeScreen,
    NotificationListScreen,
    StudentProfile,
    StudentEditProfile,
    CompleteProfileScreen,
    StudentBookingList,

    MyTutorListing,
    MyTutorDetails,
    TutorEarnings,
    TutorProfile,
    TutorProfileInfo,
    TutorProfileBusinessInfo,
    TutorProfileQualificationAndPaymentInfo,
    PaymentSucess,
    PaymentSummary,
    BidPlace,
    BidplaceSuccess,
    TutorBookSession,
    TutorSlotBooking,
    TutorHomeScreen,
    TutorSessionDetails,
    BookingSuccessFull,
    WaitingForApproval,
    MyClasses,
    MyManageSessions,
    TutorBidDetails,
    VideoCall,
    RingingView,
    SuccessScreenComponent,
    DisputeDetails,
    TutorViewProfile,
    VideoPlayer,
    BidAcceptSuccess,
    ReScheduleSession


} from '../screens/index'

import SideDrawer from "./SideDrawer";

const Stack = createStackNavigator()

export function MainStackNavigator(props) {

    return (


        <Stack.Navigator headerMode="none"
            screenOptions={() => ({
                gestureEnabled: false,
            })}
            initialRouteName={props.routeName}


        >
            <Stack.Screen name='InitialRoute' component={InitialRoute} />
            <Stack.Screen name='IntroScreen' component={IntroScreen} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='StudentRegistration' component={StudentRegistration} />
            <Stack.Screen name='TutorRegistration' component={TutorRegistration} />
            <Stack.Screen name='TutorBusinessInfo' component={TutorBusinessInfo} />
            <Stack.Screen name='TutorQualification' component={TutorQualification} />
            <Stack.Screen name='VerifyOtp' component={VerifyOtp} />
            <Stack.Screen name='UserTypeScreen' component={UserTypeScreen} />
            <Stack.Screen name='SessionDetailScreen' component={SessionDetailScreen} />
            <Stack.Screen name='SuccessScreen' component={SuccessScreen} />
            <Stack.Screen name='BidsRecieved' component={BidsRecieved} />
            <Stack.Screen name='CancellationReasonScreen' component={CancellationReasonScreen} />
            <Stack.Screen name='BookASession' component={BookASession} />
            <Stack.Screen name='SlotBooking' component={SlotBooking} />
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='LandingScreen' component={LandingScreen} />
            <Stack.Screen name='MyTutor' component={MyTutor} />
            <Stack.Screen name='CustomerCare' component={CustomerCare} />
            <Stack.Screen name='BookSession' component={BookSession} />
            <Stack.Screen name='SessionCancelScreen' component={SessionCancelScreen} />
            <Stack.Screen name='ActiveSessionsList' component={ActiveSessionsList} />
            <Stack.Screen name='ScheduledSessionsList' component={ScheduledSessionsList} />
            <Stack.Screen name='BidList' component={BidList} />
            <Stack.Screen name='Settings' component={Settings} />
            <Stack.Screen name='ReferAppScreen' component={ReferAppScreen} />
            <Stack.Screen name='PdfScreen' component={PdfScreen} />
            <Stack.Screen name='PrivacyPolicyScreen' component={PrivacyPolicyScreen} />
            <Stack.Screen name='ContactUsScreen' component={ContactUsScreen} />
            <Stack.Screen name='FAQsScreen' component={FAQsScreen} />
            <Stack.Screen name='AgreementandDisclaimerScreen' component={AgreementandDisclaimerScreen} />
            <Stack.Screen name='RateTutorScreen' component={RateTutorScreen} />
            <Stack.Screen name='RaiseDisputeScreen' component={RaiseDisputeScreen} />
            <Stack.Screen name='NotificationListScreen' component={NotificationListScreen} />
            <Stack.Screen name='StudentProfile' component={StudentProfile} />
            <Stack.Screen name='StudentEditProfile' component={StudentEditProfile} />
            <Stack.Screen name='CompleteProfileScreen' component={CompleteProfileScreen} />
            <Stack.Screen name='StudentBookingList' component={StudentBookingList} />
            <Stack.Screen name='BookingSuccessFull' component={BookingSuccessFull} />

            {/* StudentProfile */}
            <Stack.Screen name='WaitingForApproval' component={WaitingForApproval} />


            {/* Tutor */}
            <Stack.Screen name='MyTutorListing' component={MyTutorListing} />
            <Stack.Screen name='MyTutorDetails' component={MyTutorDetails} />
            <Stack.Screen name='TutorEarnings' component={TutorEarnings} />
            <Stack.Screen name='TutorProfile' component={TutorProfile} />
            <Stack.Screen name='TutorProfileInfo' component={TutorProfileInfo} />
            <Stack.Screen name='TutorProfileBusinessInfo' component={TutorProfileBusinessInfo} />
            <Stack.Screen name='TutorProfileQualificationAndPaymentInfo' component={TutorProfileQualificationAndPaymentInfo} />
            <Stack.Screen name='PaymentSucess' component={PaymentSucess} />
            <Stack.Screen name='PaymentSummary' component={PaymentSummary} />
            <Stack.Screen name='BidPlace' component={BidPlace} />
            <Stack.Screen name='BidplaceSuccess' component={BidplaceSuccess} />
            <Stack.Screen name='TutorBookSession' component={TutorBookSession} />
            <Stack.Screen name='TutorSlotBooking' component={TutorSlotBooking} />
            <Stack.Screen name='TutorHomeScreen' component={TutorHomeScreen} />
            <Stack.Screen name='TutorSessionDetails' component={TutorSessionDetails} />
            <Stack.Screen name='MyClasses' component={MyClasses} />
            <Stack.Screen name='MyManageSessions' component={MyManageSessions} />
            <Stack.Screen name='TutorBidDetails' component={TutorBidDetails} />
            <Stack.Screen name='SuccessScreenComponent' component={SuccessScreenComponent} />
            <Stack.Screen name='VideoCall' component={VideoCall} />
            <Stack.Screen name='RingingView' component={RingingView} />
            <Stack.Screen name='DisputeDetails' component={DisputeDetails} />

            <Stack.Screen name='TutorViewProfile' component={TutorViewProfile} />
            <Stack.Screen name='BidAcceptSuccess' component={BidAcceptSuccess} />


            <Stack.Screen name='VideoPlayer' component={VideoPlayer} />
            <Stack.Screen name='ReScheduleSession' component={ReScheduleSession} />



            {/* <Stack.Screen name='TutorProfile' component={TutorProfile} /> */}
            {/* <Stack.Screen name='RequestSession' component={RequestSession} /> */}
        </Stack.Navigator>
    )
}

export function MyDrawer(props) {
    return (


        <Drawer.Navigator
            edgeWidth={-20}
            swipeEnabled={false}
            gestureEnabled={false}
            openByDefault={false}

            drawerContent={() => <SideDrawer     {...props} />}
            initialRouteName={props.routeName}>
            <Drawer.Screen name="Home" component={MainStackNavigator}  {...props} />
            <Drawer.Screen name="CustomerCare" component={CustomerCare}       {...props} />
            <Drawer.Screen name="Settings" component={Settings}       {...props} />
            <Drawer.Screen name="StudentProfile" component={StudentProfile}       {...props} />
            <Drawer.Screen name="MyTutorListing" component={MyTutorListing}       {...props} />
            <Drawer.Screen name="TutorSlotBooking" component={TutorSlotBooking}       {...props} />
            <Drawer.Screen name="WaitingForApproval" component={WaitingForApproval}       {...props} />
            <Drawer.Screen name="CompleteProfileScreen" component={CompleteProfileScreen}       {...props} />
            <Drawer.Screen name="MyManageSessions" component={MyManageSessions}       {...props} />
            <Drawer.Screen name="TutorEarnings" component={TutorEarnings}       {...props} />
            <Drawer.Screen name="TutorProfile" component={TutorProfile}       {...props} />
        </Drawer.Navigator>
    );
}

const Drawer = createDrawerNavigator();