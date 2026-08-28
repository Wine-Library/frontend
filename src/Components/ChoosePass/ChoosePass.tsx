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
  const rulesSplit = RULES.slice(0, 2);
  const rulesSplitTwo = RULES.slice(3, 5);

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
        <div className={s.signupPasswordRulesWrap}>
          <div className={s.signupPasswordRulesSide}>
            {rulesSplit.map((rule) => {
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
          </div>
          <div className={s.signupPasswordRulesSide}>
            {rulesSplitTwo.map((rule) => {
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
          </div>
        </div>
      </ul>
    </div>
  );
};