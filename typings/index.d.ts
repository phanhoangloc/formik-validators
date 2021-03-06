type TranslateFn = (term: string, params?: object) => string
type FormValues = {
  [fieldName: string]: string
}
type RuleInput = {
  value: string
  values?: FormValues
  props?: any
}
type RuleOutput = string | void
type RuleFn = (ruleInput: RuleInput) => RuleOutput
type Config = {
  [fieldName: string]: RuleFn[]
}

export { TranslateFn, Config, RuleInput, RuleOutput, RuleFn, FormValues }
