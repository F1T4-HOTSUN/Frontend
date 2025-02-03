import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import useSignUp from "../../hooks/mutation/auth/useSignUp";
import useCheckDuplicateMember from "../../hooks/mutation/auth/useCheckDuplicateMember";
import { birthDateValidator, emailValidator, nameValidator, passwordValidator, phoneValidator } from "../../utils/validator";
import { ISignUpProps } from "./types";
import SignUpView from "./Views/SignUpView"
import useCheckAuthentication from "../../hooks/mutation/auth/ useCheckAuthentication";

import useToastMessage from "../../hooks/common/useToastMessage";

const SignUp = () => {

    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [authNum, setAuthNum] = useState<number | undefined>();
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("M");
    const [birth, setBirth] = useState("");
    const [phone, setPhone] = useState("");
    
    const [validData, setValidData] = useState({
        isEmailValid: false,
        isNotEmailDuplicate: false,
        isCheckAuthentication: false,
        isPasswordValid: false,
        isPasswordCheckValid: false,
        isNameValid: false,
        isBirthDateValid: false,
        isPhoneValid: false
    });

    const isNotEnterEmail = email.length === 0;
    const isNotEnterPassword = (password.length === 0)&&(passwordCheck.length === 0);
    const isNotEnterName = name.length === 0;
    const isNotEnterBirthDate = birth.length === 0;
    const isNotEnterPhone = phone.length === 0;

    const { mutate: signUpMutate } = useSignUp(navigate);
    const { mutate:checkDuplicateMemberMutate } = useCheckDuplicateMember();
    
    const { mutate: checkAuthenticationMutate } = useCheckAuthentication();
    const showToast = useToastMessage();
    const signUpProps: ISignUpProps = {
        email,
        authNum,
        password,
        passwordCheck,
        name,
        birth,
        phone,
        gender,
        onEmailChange: (e) => {
            emailValidator(e.target.value)
                ? setValidData((p) => ({ ...p, isEmailValid: true }))
                : setValidData((p) => ({ ...p, isEmailValid: false }));
            setEmail(e.target.value);
        },
        onEmailDuplicateCheck: ()=>{
            if(isNotEnterEmail) showToast("error", "이메일을 입력해주세요!");
            else if(!validData.isEmailValid) showToast("error", "올바른 이메일을 입력해주세요!");
            else{
                checkDuplicateMemberMutate({"email":email},{
                    onSuccess: data=>{
                        setValidData((p) => ({ ...p, isNotEmailDuplicate: true }))
                    },
                    onError: error => {
                        setValidData((p) => ({ ...p, isNotEmailDuplicate: false }))
                    }
                });
            }
            
        },
        onAuthNumChange: (e) => {
            setAuthNum(Number(e.target.value));
        },
        onCheckAuthentication: ()=>{
            checkAuthenticationMutate({"email":email,"authNum": authNum},{
                onSuccess: data=>{
                    setValidData((p) => ({ ...p, isCheckAuthentication: true }))
                },
                onError: error => {
                    //test
                    //setValidData((p) => ({ ...p, isCheckAuthentication: true }))

                    setValidData((p) => ({ ...p, isCheckAuthentication: false }))
                }
            });
        
        },
        onPasswordChange: (e) => {
            passwordValidator(e.target.value)
                ? setValidData((p) => ({ ...p, isPasswordValid: true }))
                : setValidData((p) => ({ ...p, isPasswordValid: false }));
            setPassword(e.target.value);
        },
        onPasswordCheckChange: (e) => {
            password===e.target.value
                ? setValidData((p) => ({ ...p, isPasswordCheckValid: true }))
                : setValidData((p) => ({ ...p, isPasswordCheckValid: false }));
            setPasswordCheck(e.target.value);
            
        },
        onNameChange: (e) => {
            nameValidator(e.target.value)
                ? setValidData((p) => ({ ...p, isNameValid: true }))
                : setValidData((p) => ({ ...p, isNameValid: false }));
            setName(e.target.value);
        },
        onSetGender: (g:string) => {
            setGender(g)
        },
        onBirthDateChange: (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '')
            .replace(/^(\d{4})(\d{2})(\d{2})$/, `$1-$2-$3`);
            birthDateValidator(e.target.value)
                ? setValidData((p) => ({ ...p, isBirthDateValid: true }))
                : setValidData((p) => ({ ...p, isBirthDateValid: false }));
            setBirth(e.target.value);
        },
        onPhoneChange: (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '')
            .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);

            phoneValidator(e.target.value)
                ? setValidData((p) => ({ ...p, isPhoneValid: true }))
                : setValidData((p) => ({ ...p, isPhoneValid: false }));
            
            setPhone(e.target.value);
        },
        onSignUp: () => {
            //console.table(validData);
            // 필수 입력값을 다 입력하지 않았을때는 경고창
            if (isNotEnterEmail||isNotEnterPassword||isNotEnterName||isNotEnterBirthDate||isNotEnterPhone){
                if (isNotEnterEmail&&isNotEnterPassword&&isNotEnterName&&isNotEnterBirthDate&&isNotEnterPhone) alert('이메일, 비밀번호, 이름, 생년월일, 핸드폰번호를 입력해주세요!')
                else if (isNotEnterEmail) alert('이메일을 입력해주세요!')
                else if (isNotEnterPassword) alert('비밀번호를 입력해주세요!')
                else if (isNotEnterName) alert('이름 입력해주세요!')
                else if (isNotEnterBirthDate) alert('생년월일을 입력해주세요!')
                else  alert('핸드폰번호를 입력해주세요!')
            }else {
                signUpMutate({ email, password, name, gender, birth, phone });
            }
            
        },
        validData,
        isNotEnterEmail,
        isNotEnterPassword,
        isNotEnterName,
        isNotEnterBirthDate,
        isNotEnterPhone
    };

    
    return <SignUpView {...signUpProps}/>
}

export default SignUp