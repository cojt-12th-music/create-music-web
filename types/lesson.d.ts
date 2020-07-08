import Origin from 'driver.js'

export interface Step extends Origin.Step {
  disableContent?: boolean
  delay?: number
  moveNext?: {
    element: string
    eventType: string
  }
}

export interface Element {
  options: Step
  node: HTMLElement
}

export interface Driver {
  options: Origin.DriverOptions
  steps: Step[]
  currentStep: number
  preventMove: () => void
  handleNext: () => void
  start(index?: number): void
  reset: (immediate?: boolean) => void
  defineSteps: (steps: Step[]) => void
}

export interface LessonState {
  isAvailable: boolean
  steps: Step[]
}
