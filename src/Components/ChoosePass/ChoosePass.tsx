import { useState } from "react";
import s from "../Signup/Signup.module.scss";
import { RULES } from "@/utils/signup";
import check from '../../assets/icons/check.svg';
import uncheck from '../../assets/icons/x-circle.svg';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ChoosePasswordField = ({ value, onChange }: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={s.signupInputWrap}>
      <span className={s.signupSpan}>Choose Password</span>
      <input
        type={visible ? "text" : "password"}
        placeholder="Password"
        className={s.signupInput}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        required
      />
      <button type="button" onClick={() => setVisible((v) => !v)} className={s.signupButtonShow}>
        {visible ? "HIDE" : "SHOW"}
      </button>

      <ul className={s.signupPasswordRules}>
        {RULES.map((rule) => {
          const met = rule.test(value);
          return (
            <li key={rule.key} className={s.signupPasswordRule}>
              <span className={met ? s.signupRuleIconMet : s.signupRuleIconUnmet}>
                <img src={met ? check : uncheck} alt="" className={s.signupRuleIcon} />
              </span>
              <span className={met ? s.signupRuleTextMet : s.signupRuleTextUnmet}>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};