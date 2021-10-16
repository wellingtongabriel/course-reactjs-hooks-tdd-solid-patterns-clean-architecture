import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import { ValidationStub } from '@/presentation/test'
import faker from 'faker'

import Login from './login'

type SutTypes = {
    sut: RenderResult
    validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
    const validationStub = new ValidationStub()
    validationStub.errorMessage = faker.random.words()
    const sut = render(<Login validation={validationStub} />)
    return { sut, validationStub }
}

describe('Login Component', () => {

    afterEach(cleanup)

    it('Should start with initial state', () => {
        const { sut, validationStub } = makeSut()
        
        const errorWrap = sut.getByTestId('error-wrap')
        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        const emailStatus = sut.getByTestId('email-status')
        const passwordStatus = sut.getByTestId('password-status')
        
        expect(errorWrap.childElementCount).toBe(0)
        expect(submitButton.disabled).toBe(true)

        expect(emailStatus.title).toBe(validationStub.errorMessage)
        expect(passwordStatus.title).toBe(validationStub.errorMessage)
        
        expect(emailStatus.textContent).toBe('🔴')
        expect(passwordStatus.textContent).toBe('🔴')
    })

    it('Should show email error is validation fails', () => {
        const { sut, validationStub } = makeSut()
        const errorMessage = faker.random.words()
        validationStub.errorMessage = errorMessage
        const emailInput = sut.getByTestId('email')

        fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
        const emailStatus = sut.getByTestId('email-status')

        expect(emailStatus.title).toEqual(errorMessage)
        expect(emailStatus.textContent).toEqual('🔴')
    })

    it('Should show password error is validation fails', () => {
        const { sut, validationStub } = makeSut()
        const errorMessage = faker.random.words()
        validationStub.errorMessage = errorMessage
        const passwordInput = sut.getByTestId('password')

        fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
        const passwordStatus = sut.getByTestId('password-status')

        expect(passwordStatus.title).toEqual(errorMessage)
        expect(passwordStatus.textContent).toEqual('🔴')
    })

    it('Should show valid password state if validation succeds', () => {
        const { sut, validationStub } = makeSut()
        validationStub.errorMessage = null
        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
        const passwordStatus = sut.getByTestId('password-status')

        expect(passwordStatus.title).toEqual('Tudo certo!')
        expect(passwordStatus.textContent).toEqual('🟢')
    })

    it('Should show valid email state if validation succeds', () => {
        const { sut, validationStub } = makeSut()
        validationStub.errorMessage = null
        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
        const emailStatus = sut.getByTestId('email-status')

        expect(emailStatus.title).toEqual('Tudo certo!')
        expect(emailStatus.textContent).toEqual('🟢')
    })
})