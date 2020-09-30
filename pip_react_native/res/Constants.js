/**
 *
 * Constants which will be used for toast messages should be declared in this file.
 */
export default {

    regex: {
        email: /^(([^<>()\[\]\\.,;:-\s@"]+(\.[^<>()\[\]\\.,;:-\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        alphabet: /^[A-Z. ]+$/i
    },
    common: {
        noInternetError: 'Please check your internet connection',
    },
    userType: {
        student: "STUDENT",
        tutor: "TUTOR",
        lowerCaseStudent: 'student',
        lowerCaseTutor: 'teacher',
    },
    routeName: {
        tutorReg: 'TutorRegistration',
        tutorBusiness: 'TutorBusinessInfo',
        tutorQualification: 'TutorQualification',
        studentReg: 'StudentRegistration',
        landingScreen: 'LandingScreen',
        userType: 'UserTypeScreen',
        login: "Login",
        homeScreen: 'HomeScreen',
        mytutor: 'MyTutor',
        myMessages: 'MyMessages',
        mybookings: 'MyBookings',
        myClasses: 'MyClasses',
        myProfile: 'MyProfile',
        settings: 'Settings',
        customerCare: 'CustomerCare',
        BookASession: 'BookASession',
        slotBooking: 'SlotBooking',
        sessionDetail: 'SessionDetailScreen',
        activeSessionsList: 'ActiveSessionsList',
        scheduledSessionList: 'ScheduledSessionsList',
        studentProfile: 'StudentProfile',
        completeProfileScreen: 'CompleteProfileScreen',
        bidList: 'BidList',
        tutorProfile: 'TutorProfile',
        bookingSuccessFull: 'BookingSuccessFull',
        completeProfileScreen: 'CompleteProfileScreen',
        tutorBookSession: 'TutorBookSession',
        tutorSlotBooking: 'TutorSlotBooking',
        waitingForApproval: 'WaitingForApproval',
        tutorBidDetails: 'TutorBidDetails',
        myManagerSession: 'MyManageSessions',
        BidPlace: 'BidPlace',
        BidplaceSuccess: 'BidplaceSuccess',
        VideoCall: 'VideoCall',
        ratetutorScreen: 'RateTutorScreen',
        raiseDisputeScreen: 'RaiseDisputeScreen',
        successScreenComponent: 'SuccessScreenComponent',
        tutorViewProfile: 'TutorViewProfile',
        disputeDetails: 'DisputeDetails',
        tutorViewProfile: 'TutorViewProfile',
        VideoPlayer: 'VideoPlayer',
        bidAcceptSuccess: 'BidAcceptSuccess',
        NotificationListScreen: 'NotificationListScreen',
        tutorPersonalDetails: 'TutorRegistration',
        tutorBusinessInfo: 'TutorBusinessInfo',
        tutorQualification: 'TutorQualification'



    },
    sessionType: {
        active: 'Active',
        applied: 'Applied',   // Not Getting this responce from Api 
        upcoming: 'Upcoming',
        started: 'Started',
        onGoing: 'Ongoing',
        completed: 'Completed',
        cancelled: 'Cancelled',
    },
    searchAPITerms: {
        education: 'education',
        grade: 'grade',
        subjects: 'subjects',
    },
    socialLoginType: {
        facebook: 'facebook',
        google: 'google',
    },
    'userDetailsFields': {
        map: "map",
        role: "role",
        is_tutor: 'is_tutor',
        is_student: 'is_student',
        isActive: 'isActive',
        isVerified: 'isVerified',
        rejected: 'rejected',
        sessions_taken: 'sessions_taken',
        _id: '_id',
        mobile: 'mobile',
        country: 'country',
        currency_code: 'currency_code',
        fcmToken: 'fcmToken',
        rating: 'rating',
        token: 'token',
        name: 'name',
        profile_picture: 'profile_picture',
        email: 'email',
        education: 'student_education',
        tutoredu: 'tutor_education',
        location: 'location',
        business_license_number: 'business_license_number',
        insurance_number: 'insurance_number',
        address_proof: 'address_proof',
        certification_of_service: 'certification_of_service',
        identity_proof: 'identity_proof',
        insurance_number: 'insurance_number',
        license_image: 'license_image',
        tutor_education: 'tutor_education',
        tutor_education_details: 'tutor_education_details',
        qualification: 'qualification',
        tutor_grade: 'tutor_grade',
        tutor_teaching_subject: 'tutor_teaching_subject',
        sender_referral_id: 'sender_referral_id',
        stage_count: ''
    },

    countryCodeFields: {
        commission: 'commission',
        penalty: 'penalty',
        tax: 'tax',
        _id: '_id',
        country: 'country',
        country_code: 'country_code',
        code: 'code',
        currency: 'currency',
        currency_code: 'currency_code',
        currency_symbol: 'currency_symbol',
        unicode: 'unicode',
        regex: 'regex',
    },
    dateTime: {
        date: 'date',
        time: 'time'

    },
    commisionType: {
        bookings: 'Bookings',
        reschedule: 'Reschedule',
    },

    activeSessionStatus: {
        active: 'Active',
        applied: 'Applied',
    },
    updateBid: {
        accept: 'Accept',
        reject: 'Reject',
    },
    verifyCharges: {
        cancellation: 'Cancellation',
        reschedule: 'Reschedule'
    },
    PushNotificationConstants: {
        sessionDetailStudent: 'sessionDetailStudent',
        bidListStudent: 'bidListStudent',
        rewardReceived: 'rewardReceived',
        profileRejected: 'profileRejected'

    }
}