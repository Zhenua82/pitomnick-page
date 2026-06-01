import styles from './phoneButton.module.css'

export default function PhoneButton(){
    return (
        <div className={styles.buttonContainer}>
            <a href="tel:+79110991929" className={styles.phoneButton}></a>
            <span>Имеются вопросы, звоните!</span>
        </div>
    )
}