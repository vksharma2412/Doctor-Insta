
import { StackActions, CommonActions } from '@react-navigation/native';
export default class NavUtil {

    static navUtil = NavUtil.navUtil == null ? new NavUtil() : this.navUtil;

    navigateToHome(context, params = {}) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [CommonActions.navigate({ routeName: 'HomeScreen', params })]
        })
        context.props.navigation.dispatch(resetAction)

    }

    navigateToLogin(context, params = {}) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [CommonActions.navigate({ routeName: 'Login', params })]
        })
        context.props.navigation.dispatch(resetAction)

    }

    // AddPeriodDate
    navigateToAddPeriodDate(context, params = {}) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [CommonActions.navigate({ routeName: 'AddPeriodDate', params })]
        })
        context.props.navigation.dispatch(resetAction)
    }

    navigateWithResetStack(context, screen, params = {}) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [CommonActions.navigate({ routeName: screen, params })]
        })
        context.props.navigation.dispatch(resetAction)

    }

    navigateTo(context, screen, props) {
        // log("Navigating to" + screen)
        context.props.navigation.navigate(screen, props, { ...context.props });

    }
}