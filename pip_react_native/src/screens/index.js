import App from './App'
import LandingScreen from './LandingScreen'
import InitialRoute from "./InitialRoute";
import IntroScreen from "./Intro/IntroScreen";
import Login from "./authentication/Login";
import StudentRegistration from "./authentication/StudentRegistration";
import TutorRegistration from "./authentication/TutorRegistration";
import TutorBusinessInfo from './authentication/TutorBusinessInfo'
import TutorQualification from './authentication/TutorQualification'
import HomeScreen from "./HomeScreen";
import NetworkManager from "../utils/NetworkManager";
import VerifyOtp from './authentication/VerifyOtp';
import UserTypeScreen from './userType/UserTypeScreen';
import SessionDetailScreen from './session/SessionDetailScreen';
import SuccessScreen from '../screens/session/SucessScreen';
import BidsRecieved from '../screens/session/BidsRecieved';
import CancellationReasonScreen from '../screens/session/CancellationReasonScreen';
import BookSession from "./session/BookSession";
//import RequestSession from "./session/RequestSession";
import BookASession from '../screens/session/BookASession';
import SlotBooking from '../screens/session/SlotBooking';
import MyTutor from "../screens/DrawerItems/MyTutor";
import CustomerCare from "../screens/DrawerItems/CustomerCare";
import SessionCancelScreen from '../screens/session/SessionCancelScreen'
import ActiveSessionsList from "../screens/session/ActiveSessionsList";
import ScheduledSessionsList from "../screens/session/ScheduledSessionsList";
import BidList from "../screens/session/BidList";
import TutorProfile from "../screens/tutor/TutorProfile";
import Settings from "../screens/DrawerItems/Settings";
import ReferAppScreen from "./ReferApp/ReferAppScreen";
import PdfScreen from "./AboutUs/PdfScreen";
import PrivacyPolicyScreen from "./PrivacyPolicy/PrivacyPolicyScreen";
import ContactUsScreen from "./ContactUs/ContactUsScreen";
import FAQsScreen from "./FAQs/FAQsScreen";
import AgreementandDisclaimerScreen from "./AgreementandDisclaimer/AgreementandDisclaimerScreen";
import RateTutorScreen from "../screens/Rate/RateTutorScreen"
import RaiseDisputeScreen from "../screens/Dispute/RaiseDisputeScreen"
import NotificationListScreen from "../screens/NotificationList/NotificationListScreen"
import StudentProfile from '../screens/StudentProfile/StudentProfile';
import StudentEditProfile from '../screens/StudentProfile/StudentEditProfile';
import CompleteProfileScreen from "../screens/tutor/CompleteProfileScreen";
import StudentBookingList from "../screens/Bookings/StudentBookingList";
import BookingSuccessFull from "./session/BookingSuccessFull";
import MyTutorListing from '../screens/tutor/MyTutorListing';
import MyTutorDetails from '../screens/tutor/MyTutorDetails';
import TutorEarnings from '../screens/tutor/TutorEarnings';
import TutorProfileInfo from '../screens/tutor/TutorProfileInfo';
import TutorProfileBusinessInfo from '../screens/tutor/TutorProfileBusinessInfo';
import TutorProfileQualificationAndPaymentInfo from '../screens/tutor/TutorProfileQualificationAndPaymentInfo';
import PaymentSucess from '../screens/Payment/PaymentSucess';
import PaymentSummary from '../screens/Payment/PaymentSummary';
import BidplaceSuccess from '../screens/Bid/BidplaceSuccess';
import TutorBookSession from '../screens/tutor/TutorBookSession';
import TutorSlotBooking from '../screens/tutor/TutorSlotBooking';
import TutorHomeScreen from '../screens/tutor/TutorHomeScreen';
import TutorSessionDetails from '../screens/tutor/TutorSessionDetails';
import WaitingForApproval from "./tutor/WaitingForApproval";
import MyClasses from "../screens/DrawerItems/MyClasses"
import MyManageSessions from "../screens/DrawerItems/MyManageSessions"
import TutorBidDetails from "./session/TutorBidDetails";
import VideoCall from "../screens/openTok/openTok"
import BidPlace from "../screens/Bid/BidPlace"
import RingingView from "../screens/Ringer/RingingIOS";
import SuccessScreenComponent from "../components/SuccessScreenComponent";
import DisputeDetails from "../screens/Dispute/DisputeDetails";
import TutorViewProfile from '../screens/session/TutorViewProfile';
import VideoPlayer from '../screens/Video/video';
import BidAcceptSuccess from '../screens/session/BidAcceptSuccess';
import ReScheduleSession from '../screens/tutor/ReScheduleSession';

















export {
    App,
    LandingScreen,
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
    SessionDetailScreen,
    SuccessScreen,
    BidsRecieved,
    CancellationReasonScreen,
    NetworkManager,
    BookSession,
    //    RequestSession,
    BookASession,
    SlotBooking,
    MyTutor,
    CustomerCare,
    SessionCancelScreen,
    ActiveSessionsList,
    ScheduledSessionsList,
    BidList,
    TutorProfile,
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
    BookingSuccessFull,
    MyTutorListing,
    MyTutorDetails,
    TutorEarnings,
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

}