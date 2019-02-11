import * as R from 'ramda'
import { isArray, isObject } from 'ramda-adjunct'
import { Config, FormValues } from '../typings'
import { getIn } from 'formik'

const getFieldProps = (props: any, name: string) => ({
  value: getIn(props.values, name),
  touched: getIn(props.touched, name),
  error: getIn(props.errors, name) || '',
  setFieldValue: props.setFieldValue,
  handleBlur: props.handleBlur,
  handleChange: props.handleChange
})

const removeUndefinedValuesAndEmptyObjects = (object: Object): Object => {
  return R.compose(
    R.reduce((accumulated, element: string) => {
      const value = object[element]
      if (value === undefined) {
        return accumulated
      }

      if (isArray(value)) {
        return R.assoc(
          element,
          value.map(removeUndefinedValuesAndEmptyObjects),
          accumulated
        )
      }

      if (isObject(value)) {
        if (R.isEmpty(value)) return accumulated
        const trimmedValue = removeUndefinedValuesAndEmptyObjects(value)
        if (R.isEmpty(trimmedValue)) return accumulated
        return R.assoc(element, trimmedValue, accumulated)
      }

      return R.assoc(element, value, accumulated)
    }, {}),
    R.keys
  )(object)
}

const getValuesBasedOnObjectKeys = (config: Object, result: Object): Object => {
  if (!config) return {}

  return Object.keys(config).reduce((acc, key) => {
    const subConfig: any = config[key]
    const value = result[key] as FormValues
    if (isArray(value)) {
      return R.assoc(
        key,
        value.map((item) => getValuesBasedOnObjectKeys(subConfig, item)),
        acc
      )
    }

    if (isObject(value)) {
      return R.assoc(key, getValuesBasedOnObjectKeys(subConfig, value), acc)
    }

    if (R.has(key, result)) {
      return R.assoc(key, value, acc)
    }

    return acc
  }, {})
}

export {
  removeUndefinedValuesAndEmptyObjects,
  getValuesBasedOnObjectKeys,
  getFieldProps
}
